import mongoose from "mongoose";


type ConnectionObject ={
    isConnected?:number
}

const connection:ConnectionObject = {}

async function dbConnect(): Promise<void> {
    //database aageiii connected ase naki checking...
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI ||'' ,{});

        connection.isConnected = db.connections[0].readyState;
        //database connected .....

        console.log("DB Connected Successfully");
    } catch (error) {
        console.log("Database connection failed ", error);
        process.exit(1);
    }

}
export default dbConnect;