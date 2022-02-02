# serverlessrepo-cafdev-cloudfront-access-logs

Description: Stack that deploys a bucket which you can use as a target for your Amazon CloudFront access logs (use the prefix 'new/'). An event notification is configured so that new objects created will fire an AWS Lambda function that moves the objects to prefixes (under 'partitioned-gz/') that adhere to the Apache Hive partitioning format. This way the data is easier to consume for big data tools (as Amazon Athena and AWS Glue). 

Parameters: 
|Key|Value|
|---|---|
|GzKeyPrefix|partitioned-gz/|
|NewKeyPrefix|new/|
|ParquetKeyPrefix|partitioned-parquet/|
|ResourcePrefix|cafprod|

Reference: https://aws.amazon.com/blogs/big-data/analyze-your-amazon-cloudfront-access-logs-at-scale/
