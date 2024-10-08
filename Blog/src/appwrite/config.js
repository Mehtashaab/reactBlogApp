import conf from '../conf/conf';
import { Client, ID, Databases, Storage, Query } from "appwrite";


export class Service{
    client = new Client();
    databases;
    bucket;
    
    constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }



async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
        // Use ID.unique() for auto-generating document IDs if you want to skip using slug directly
        const documentId = ID.unique(); // Automatically generate unique document ID

        return await this.databases.createDocument(
            conf.appwriteDatabaseId,   // Replace with your Appwrite database ID
            conf.appwriteCollectionId, // Replace with your Appwrite collection ID
            documentId,                // Use documentId instead of slug for unique ID generation
            {
                title: title,             // Ensure correct data types for each field
                content: content,         // Text or string
                featuredImage: featuredImage, // Text or URL
                status: status,           // Boolean or string (depending on your schema)
                userId: userId            // Text or string (ensure it matches Appwrite's user model)
            }
        );
    } catch (error) {
        // Log detailed error information for debugging
        console.log("Appwrite Service :: createPost :: error", error.message);
    }
}


    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,

                }
            )
        } catch (error) {
            console.log("Appwrite Service :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
            return true
        } catch (error) {
            console.log("Appwrite Service :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            
            )
        } catch (error) {
            console.log("Appwrite Service :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = []) {
        try {
            // Optionally, if the "status" field does exist, make sure it's being queried correctly.
            if (queries.length === 0) {
                queries.push(Query.equal("status", "active"));
            }
    
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            );
        } catch (error) {
            console.log("Appwrite Service :: getPosts :: error", error);
            return false;
        }
    }
    
    // file upload service

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite Service :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite Service :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
    }
}


const service = new Service()
export default service