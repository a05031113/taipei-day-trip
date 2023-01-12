import boto3
import requests

test_file = 'icon_setting.png'

s3_client = boto3.client(
    's3',
    endpoint_url="https://8991e795ca5753a87e4898f1070227f7.r2.cloudflarestorage.com",
    aws_access_key_id="6831794db4ed58acb5ef556c7e91a3f0",
    aws_secret_access_key="43b9623de13e33c8c4a2c5f5700d569cd1c213a459090b449cb6d4e0e0c1aa05"
)

# Generate the presigned URL
response = s3_client.generate_presigned_url(
    ClientMethod='put_object',
    Params={
        'Bucket': 'test',
        'Key': test_file,
    },
    ExpiresIn=3600
)

print(response)

# Upload file to S3 using presigned URL
files = {'file': open(test_file, 'rb')}
r = requests.put(response, files=files)
print(r.status_code)
