import random
import pandas as pd

random.seed(42)

rows = []

####################################################
# 500 CORRECT BICEP CURLS
####################################################

for _ in range(500):

    elbow = random.gauss(37, 4)

    speed = random.gauss(1.8, 0.35)

    symmetry = random.gauss(6, 3)

    # Small natural variation
    if random.random() < 0.15:
        elbow += random.uniform(-6, 6)

    if random.random() < 0.15:
        speed += random.uniform(0.3, 1.0)

    if random.random() < 0.15:
        symmetry += random.uniform(3, 8)

    elbow = max(25, min(50, elbow))
    speed = max(1.2, min(4.5, speed))
    symmetry = max(0, min(20, symmetry))

    rows.append([
        round(elbow,2),
        round(speed,2),
        round(symmetry,2),
        "correct"
    ])

####################################################
# 500 INCORRECT BICEP CURLS
####################################################

for _ in range(500):

    elbow = random.gauss(54, 7)

    speed = random.gauss(4.0, 2.0)

    symmetry = random.gauss(20, 10)

    # Some incorrect curls may still have near-correct values
    if random.random() < 0.20:
        elbow = random.gauss(42, 4)

    if random.random() < 0.20:
        speed = random.gauss(2.2, 0.5)

    if random.random() < 0.20:
        symmetry = random.gauss(8, 3)

    elbow = max(0, min(70, elbow))
    speed = max(0.5, min(12, speed))
    symmetry = max(0, min(60, symmetry))

    rows.append([
        round(elbow,2),
        round(speed,2),
        round(symmetry,2),
        "incorrect"
    ])

####################################################

df = pd.DataFrame(
    rows,
    columns=[
        "elbow_angle",
        "rep_speed",
        "symmetry",
        "form_quality",
    ],
)

df.to_csv("bicep_dataset.csv", index=False)

print(df.head())
print()
print(df.tail())
print()
print("Dataset saved successfully.")
print(df["form_quality"].value_counts())