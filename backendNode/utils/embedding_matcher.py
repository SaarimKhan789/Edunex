# utils/embedding_matcher.py

import sys
import json
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

def match_columns(global_cols, schema_cols):
    global_embeddings = model.encode(global_cols, convert_to_tensor=True)
    schema_embeddings = model.encode(schema_cols, convert_to_tensor=True)

    results = {}
    for i, global_col in enumerate(global_cols):
        similarities = util.pytorch_cos_sim(global_embeddings[i], schema_embeddings)[0]
        top_matches = sorted(
            [(schema_cols[j], float(similarities[j])) for j in range(len(schema_cols))],
            key=lambda x: x[1],
            reverse=True
        )
        results[global_col] = [
            {"col": match[0], "similarity": match[1]} for match in top_matches if match[1] > 0.5
        ]
    return results

if __name__ == "__main__":
    try:
        data = json.load(sys.stdin)
        global_cols = data["global_cols"]
        schema_cols = data["schema_cols"]
        output = match_columns(global_cols, schema_cols)
        print(json.dumps(output))
    except Exception as e:
        print(f"❌ Python error: {e}", file=sys.stderr)
        sys.exit(1)
