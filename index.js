const {Storage} = require('@google-cloud/storage');
const {storage} = require('image-steam');

const StorageBase = storage.Base;

module.exports = class StorageGCS extends StorageBase {
    constructor(opts = {}) {
        super(opts);

        const {bucket, projectId} = opts;

        if (!bucket) {
            throw new Error('StorageGCS.bucket is required');
        }
        this.Bucket = bucket;

        let gcsClientParams = {};

        if (projectId) {
            gcsClientParams.projectId = projectId;
        }

        // First check to see if we should load a Service Account file by name (fully qualified path)
        if (opts.serviceAccountKeyFilename) {
            gcsClientParams.keyFilename = opts.serviceAccountKeyFilename;
        }
        // Else check to see if we're using an email/private_key combo
        else if (opts.privateKey) {

            if (!opts.clientEmail) {
                throw new Error('StorageGCS.clientEmail is required when privateKey is specified');
            }
            gcsClientParams.credentials = {
                'client_email': opts.clientEmail,
                'private_key': opts.privateKey,
            }
        }
        // We don't fail at this point simply because the required variables can still be read from the "environment" using Application Default Credentials (ADC) when running in a GCP environment

        this.gcsClient = new Storage(gcsClientParams);
    }

    fetch(options, originalPath, stepsHash, callback) {
        const {Bucket} = this;

        const fileChunks = [];

        this.gcsClient
            .bucket(Bucket)
            .file(originalPath)
            .createReadStream() //Create a stream that we can use to read the file chunks from
            .on('data', (dataChunk) => {
                // We've received a part of the file, store it so we can concatenate it with the rest of the chunks later
                fileChunks.push(dataChunk);

            })
            .on('error', (err) => {
                return void callback(
                    new Error('StorageGCS.fetch error: ' + err.code + ' for ' + (Bucket + '/' + originalPath))
                );
            })
            .on('end', () => {
                // The file download is complete, concatenate the chunks nad return the value via the callback
                callback(null, {path: originalPath, stepsHash: stepsHash}, Buffer.concat(fileChunks));
            });
    }
};
