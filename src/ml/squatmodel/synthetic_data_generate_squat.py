import random
import pandas as pd

random.seed(42)

rows = []


def clip(value, low, high):
    return max(low, min(value, high))



# 500 CORRECT


for _ in range(500):

    knee = clip(random.gauss(88,4),76,98)

    hip = clip(random.gauss(91,5),82,103)

    back = clip(random.gauss(29.8,2.0),25,34)

    depth = clip(random.gauss(0.102,0.012),0.075,0.135)

    speed = clip(random.gauss(2.8,0.45),1.8,4.2)

    symmetry = clip(random.gauss(3.4,1.8),0,8)

    rows.append([
        round(knee,2),
        round(hip,2),
        round(back,2),
        round(depth,4),
        round(speed,2),
        round(symmetry,2),
        "correct"
    ])



# 500 INCORRECT


for _ in range(500):

    knee = clip(random.gauss(88,12),60,112)

    hip = clip(random.gauss(145,18),112,180)

    back = clip(random.gauss(8,6),0,22)

    depth = clip(random.gauss(0.175,0.03),0.09,0.24)

    speed = clip(random.gauss(4.0,2.2),1.8,18)

    symmetry = clip(random.gauss(12,5),3,25)

    # some incorrect reps almost look correct
    if random.random() < 0.20:
        knee = clip(random.gauss(90,3),82,98)

    if random.random() < 0.15:
        hip = clip(random.gauss(115,4),108,122)

    if random.random() < 0.15:
        back = clip(random.gauss(18,2),14,22)

    rows.append([
        round(knee,2),
        round(hip,2),
        round(back,2),
        round(depth,4),
        round(speed,2),
        round(symmetry,2),
        "incorrect"
    ])




df = pd.DataFrame(
    rows,
    columns=[
        "knee_angle",
        "hip_angle",
        "back_angle",
        "depth",
        "rep_speed",
        "symmetry",
        "form_quality"
    ]
)

df.to_csv("squat_dataset.csv",index=False)

print(df.head())
print(df.tail())
print(df.form_quality.value_counts())