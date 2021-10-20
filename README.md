# image-steam-gcs

###[Google Cloud Storage](https://cloud.google.com/storage) driver for [Image Steam](https://github.com/asilvas/node-image-steam).

### Setup

```sh
git clone https://github.com/deanboonzaier/image-steam-gcs.git
cd image-steam-gcs
npm install
```

## Options

Please note that many of the options listed below can be derived automatically from the environment when running in a Google Cloud environment with an attached service account using Application Default Credentials, see [using GCP ADC](https://cloud.google.com/docs/authentication/production#providing_credentials_to_your_application) for more information on this.

| Name                      	| Type     	| Attributes       	| Info                                                                                                                                                                                                                                                       	|
|---------------------------	|----------	|------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| bucket                    	| `string` 	| ***Required*** 	| Name of the GCS bucket.                                                                                                                                                                                                                                     	|
| projectId                 	| `string` 	| ***Optional*** 	| The project ID of the GCP project that owns the service account. Can be detected automatically when running in an environment that uses ADC.                                                                                                                                                                                            	|
| serviceAccountKeyFilename 	| `string` 	| ***Optional*** 	| Full path to the a .json, .pem, or .p12 key downloaded from the Google Developers Console. If you provide a path to a JSON file, the projectId option above is not necessary. NOTE: .pem and .p12 require you to specify the `clientEmail` option as well. 	|
| clientEmail               	| `string` 	| ***Optional*** 	| Required in combination with the `privateKey` option. The email address of the service account associated with the specified `privateKey`.                                                                                                                 	|
| privateKey                	| `string` 	| ***Optional*** 	| Required in combination with the `clientEmail` option. The service account private key for the specified `clientEmail`.                                                                                                                                        	|

See the [Google Cloud Storage Options docs](https://googleapis.dev/nodejs/storage/latest/global.html#StorageOptions) for more details.

## Usage

Example:

```ecmascript 6
import isteam from 'image-steam';

const options = {
    storage: {
        app: {
            static: {
                driver: 'http',
                endpoint: 'https://some-endpoint.com'
            }
        },
        mygcsapp: {
            driverPath: 'image-steam-gcs',
            bucket: 'myBucketNameGoesHere',
            projectId: 'cobra-starship',
            clientEmail: 'myservice-account@cobra-starship.iam.gserviceaccount.com',
            privateKey: '-----BEGIN PRIVATE KEY-----\nSERVICE-ACCOUNT-PRIVATE-KEY-GOES-HERE\n-----END PRIVATE KEY-----\n'
        }
    }
}

http.createServer(new isteam.http.Connect(options).getHandler())
    .listen(13337, '127.0.0.1')
;
```
