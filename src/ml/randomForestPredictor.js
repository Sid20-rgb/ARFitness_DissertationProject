export async function loadRandomForestModel(modelPath) {
  const response = await fetch(modelPath);

  if (!response.ok) {
    throw new Error(`Failed to load model: ${modelPath}`);
  }

  return await response.json();
}

function predictTree(tree, featureValues) {
  let node = 0;

  while (tree.children_left[node] !== -1) {
    const featureIndex = tree.feature[node];
    const threshold = tree.threshold[node];

    if (featureValues[featureIndex] <= threshold) {
      node = tree.children_left[node];
    } else {
      node = tree.children_right[node];
    }
  }

  const values = tree.value[node][0];

  const maxIndex = values.indexOf(Math.max(...values));

  return maxIndex;
}

export function predictRandomForest(model, featuresObject) {
  if (!model) {
    return "Model not loaded";
  }

  const featureValues = model.features.map(
    (featureName) => featuresObject[featureName] ?? 0,
  );

  const votes = {};

  model.trees.forEach((tree) => {
    const classIndex = predictTree(tree, featureValues);

    const className = model.classes[classIndex];

    votes[className] = (votes[className] || 0) + 1;
  });

  const prediction = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];

  return prediction;
}

const squatModel = await loadRandomForestModel(
  "/squat_random_forest_model.json",
);

const bicepCurlModel = await loadRandomForestModel(
  "/bicepcurl_random_forest_model.json",
);
