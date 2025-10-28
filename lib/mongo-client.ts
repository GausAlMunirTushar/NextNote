import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

if (!uri) throw new Error("❌ Please define MONGODB_URI in .env.local");

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
	// Use a global variable in dev to avoid hot-reload issues
	if (!(global as any)._mongoClientPromise) {
		client = new MongoClient(uri, options);
		(global as any)._mongoClientPromise = client.connect();
	}
	clientPromise = (global as any)._mongoClientPromise;
} else {
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export default clientPromise;
