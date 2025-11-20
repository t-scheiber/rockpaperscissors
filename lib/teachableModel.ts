const MODEL_PATH = "/AI/model.json";
const METADATA_PATH = "/AI/metadata.json";
const FALLBACK_IMAGE_SIZE = 224;

type TfModule = typeof import("@tensorflow/tfjs");

type Metadata = {
  labels: string[];
  imageSize?: number;
};

let tfModulePromise: Promise<TfModule> | null = null;
let modelPromise: Promise<import("@tensorflow/tfjs").LayersModel> | null = null;
let metadataPromise: Promise<Metadata> | null = null;

async function getTfModule() {
  if (!tfModulePromise) {
    tfModulePromise = import("@tensorflow/tfjs").then(async (module) => {
      await module.ready();
      return module;
    });
  }
  return tfModulePromise;
}

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await getTfModule();
      return tf.loadLayersModel(MODEL_PATH);
    })();
  }
  return modelPromise;
}

async function getMetadata() {
  if (!metadataPromise) {
    metadataPromise = fetch(METADATA_PATH)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to load Teachable Machine metadata.");
        }
        return response.json();
      })
      .then((data: Metadata) => ({
        labels: data.labels ?? [],
        imageSize: data.imageSize ?? FALLBACK_IMAGE_SIZE,
      }));
  }
  return metadataPromise;
}

function loadImageElement(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to load the captured image for prediction."));
    image.src = dataUrl;
  });
}

export async function predictHandFromImage(dataUrl: string) {
  const [tf, model, metadata, image] = await Promise.all([
    getTfModule(),
    getModel(),
    getMetadata(),
    loadImageElement(dataUrl),
  ]);

  const logits = tf.tidy(() => {
    const pixels = tf.browser.fromPixels(image).toFloat();
    const resized = tf.image.resizeBilinear(
      pixels,
      [metadata.imageSize ?? FALLBACK_IMAGE_SIZE, metadata.imageSize ?? FALLBACK_IMAGE_SIZE],
      true,
    );
    const normalized = resized.div(tf.scalar(255));
    const batched = normalized.expandDims(0);
    return model.predict(batched) as import("@tensorflow/tfjs").Tensor;
  });

  const probabilities = Array.from(await logits.data());
  logits.dispose();

  if (!probabilities.length) {
    throw new Error("Model did not return any prediction values.");
  }
  if (!metadata.labels.length) {
    throw new Error("No labels found in Teachable Machine metadata.");
  }

  const bestIndex = probabilities.reduce(
    (highestIndex, probability, index, arr) =>
      probability > arr[highestIndex] ? index : highestIndex,
    0,
  );

  return metadata.labels[bestIndex] ?? "";
}

