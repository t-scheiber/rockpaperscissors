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
    }).catch((error) => {
      tfModulePromise = null;
      throw error;
    });
  }
  return tfModulePromise;
}

async function getModel() {
  if (!modelPromise) {
    modelPromise = (async () => {
      const tf = await getTfModule();
      return tf.loadLayersModel(MODEL_PATH);
    })().catch((error) => {
      modelPromise = null;
      throw error;
    });
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
      }))
      .catch((error) => {
        metadataPromise = null;
        throw error;
      });
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

// Match @teachablemachine/image 0.8.5 cropTo before applying its capture normalization.
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image
function centerCropImage(image: HTMLImageElement, size: number) {
  const scale = size / Math.min(image.width, image.height);
  const width = Math.ceil(image.width * scale);
  const height = Math.ceil(image.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create a canvas for model input.");
  }
  context.drawImage(
    image,
    -Math.floor((width - size) / 2),
    -Math.floor((height - size) / 2),
    width,
    height,
  );
  return canvas;
}

export async function predictHandFromImage(dataUrl: string) {
  const [tf, model, metadata, image] = await Promise.all([
    getTfModule(),
    getModel(),
    getMetadata(),
    loadImageElement(dataUrl),
  ]);

  const logits = tf.tidy(() => {
    const cropped = centerCropImage(image, metadata.imageSize ?? FALLBACK_IMAGE_SIZE);
    const batched = tf.browser.fromPixels(cropped).expandDims(0).toFloat()
      .div(tf.scalar(127)).sub(tf.scalar(1));
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

