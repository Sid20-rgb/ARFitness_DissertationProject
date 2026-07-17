import pandas as pd
import joblib
import matplotlib.pyplot as plt
import json
import os

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.model_selection import cross_val_score

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    ConfusionMatrixDisplay,
)

# =========================
# 1. LOAD DATASET
# =========================

DATASET_PATH = "squat_dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("Dataset loaded successfully")
print(df.head())
print("\nDataset shape:", df.shape)
print("\nClass distribution:")
print(df["form_quality"].value_counts())


# =========================
# 2. BASIC DATA CLEANING
# =========================

# Remove timestamp because it is not useful for ML training
if "timestamp" in df.columns:
    df = df.drop(columns=["timestamp"])

# Remove empty unnamed columns if Excel created them
df = df.loc[:, ~df.columns.str.contains("^Unnamed")]

# Remove impossible/noisy values if any remain
df = df[df["knee_angle"] >= 40]
df = df[df["hip_angle"] >= 40]

print("\nAfter cleaning:", df.shape)
print(df["form_quality"].value_counts())


# =========================
# 3. FEATURE SELECTION
# =========================

features = [
    "knee_angle",
    "hip_angle",
    "back_angle",
    "depth",
    "rep_speed",
    "symmetry",
]

X = df[features]

y = df["form_quality"]


# =========================
# 4. TRAIN-TEST SPLIT
# =========================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", X_train.shape[0])
print("Testing samples:", X_test.shape[0])


# =========================
# 5. TRAIN MODELS
# =========================

models = {
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Random Forest": RandomForestClassifier(
        n_estimators=100,
        random_state=42
    ),
    "SVM": SVC(kernel="linear", random_state=42),
}


results = []

for name, model in models.items():
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    acc = accuracy_score(y_test, predictions)
    precision = precision_score(
        y_test,
        predictions,
        pos_label="correct"
    )
    recall = recall_score(
        y_test,
        predictions,
        pos_label="correct"
    )
    f1 = f1_score(
        y_test,
        predictions,
        pos_label="correct"
    )

    results.append({
        "Model": name,
        "Accuracy": acc,
        "Precision": precision,
        "Recall": recall,
        "F1 Score": f1,
    })

    print("\n==============================")
    print(name)
    print("==============================")
    print(classification_report(y_test, predictions))


# =========================
# 6. MODEL COMPARISON TABLE
# =========================

results_df = pd.DataFrame(results)

print("\nModel Comparison:")
print(results_df)

results_df.to_csv("model_comparison_results.csv", index=False)

# =========================
# 6.5 CROSS VALIDATION
# =========================


rf = models["Random Forest"]

cv_scores = cross_val_score(
    rf,
    X,
    y,
    cv=5,
    scoring="accuracy"
)

print("\nRandom Forest 5-Fold Cross Validation Scores:")
print(cv_scores)

print(
    "\nMean CV Accuracy:",
    round(cv_scores.mean(), 4)
)

print(
    "Standard Deviation:",
    round(cv_scores.std(), 4)
)

# =========================
# 7. SELECT BEST MODEL
# =========================

best_model = models["Random Forest"]

rf_predictions = best_model.predict(X_test)


# =========================
# 8. CONFUSION MATRIX
# =========================

ConfusionMatrixDisplay.from_predictions(
    y_test,
    rf_predictions,
    cmap="Blues"
)

plt.title("Random Forest Confusion Matrix")
plt.savefig("confusion_matrix.png", dpi=300, bbox_inches="tight")
plt.show()


# =========================
# 9. FEATURE IMPORTANCE
# =========================

importance_df = pd.DataFrame({
    "Feature": features,
    "Importance": best_model.feature_importances_
}).sort_values(by="Importance", ascending=False)

print("\nFeature Importance:")
print(importance_df)

importance_df.to_csv("feature_importance.csv", index=False)

plt.figure(figsize=(8, 5))
plt.bar(
    importance_df["Feature"],
    importance_df["Importance"]
)
plt.title("Random Forest Feature Importance")
plt.xlabel("Feature")
plt.ylabel("Importance")
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig("feature_importance.png", dpi=300, bbox_inches="tight")
plt.show()


# =========================
# 10. SAVE TRAINED MODEL
# =========================

joblib.dump(best_model, "squat_random_forest_model.pkl")


def export_tree(tree):
    tree_ = tree.tree_

    return {
        "children_left": tree_.children_left.tolist(),
        "children_right": tree_.children_right.tolist(),
        "feature": tree_.feature.tolist(),
        "threshold": tree_.threshold.tolist(),
        "value": tree_.value.tolist(),
    }

forest_json = {
    "features": features,
    "classes": best_model.classes_.tolist(),
    "trees": [export_tree(tree) for tree in best_model.estimators_],
}

with open("squat_random_forest_model.json", "w") as f:
    json.dump(forest_json, f)

print("- squat_random_forest_model.json")

print("\nTraining complete.")
print("Saved files:")
print("- squat_random_forest_model.pkl")
print("- model_comparison_results.csv")
print("- feature_importance.csv")
print("- confusion_matrix.png")
print("- feature_importance.png")