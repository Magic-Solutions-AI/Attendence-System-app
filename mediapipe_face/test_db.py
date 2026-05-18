import sqlite3
import app
import json
import sqlite3
import numpy as np

def run_test():
    # Insert a dummy student
    conn = sqlite3.connect(app.DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO students (id, student_name, face_registered) VALUES ('test-id', 'Test User', 0)")
    conn.commit()
    conn.close()

    # Simulate registration
    client = app.app.test_client()
    
    # We need a valid base64 image (a 1x1 black pixel base64 will fail MediaPipe)
    # Instead, let's just directly test the database behavior by manually injecting the embedding
    dummy_emb = np.random.rand(462).astype(np.float32)
    dummy_emb /= np.linalg.norm(dummy_emb)
    emb_str = ",".join(str(x) for x in dummy_emb.tolist())

    conn = sqlite3.connect(app.DB_PATH)
    c = conn.cursor()
    c.execute("UPDATE students SET face_registered = 1, face_embedding = ? WHERE id = ?", (emb_str, 'test-id'))
    conn.commit()
    conn.close()
    
    # Now load students
    embs, meta = app.load_registered_students()
    print("Loaded embeddings:", len(embs))
    if meta:
        print("Metadata:", meta[0])
    
    # Clean up
    conn = sqlite3.connect(app.DB_PATH)
    c = conn.cursor()
    c.execute("DELETE FROM students WHERE id = 'test-id'")
    conn.commit()
    conn.close()

if __name__ == '__main__':
    run_test()
