# CafDev QuickSight Dashboard Web Application

- [CafDev QuickSight Dashboard Web Application](#cafdev-quicksight-dashboard-web-application)
  - [References](#references)
  - [S3 Bucket for the Web Client](#s3-bucket-for-the-web-client)
  - [CloudFront Distribution](#cloudfront-distribution)
    - [WAF ACL for CloudFront](#waf-acl-for-cloudfront)
  - [IAM Role for QuickSight Access](#iam-role-for-quicksight-access)
  - [QuickSight](#quicksight)
  - [Lambda](#lambda)
    - [](#)
    - [Lambda lambda_api_gateway_options_response](#lambda-lambda_api_gateway_options_response)
  - [Cognito, Create a user pool](#cognito-create-a-user-pool)
  - [Cognito, Manage Identity Pools](#cognito-manage-identity-pools)
  - [API Gateway](#api-gateway)
    - [API Definition](#api-definition)
    - [Test Using the API Client](#test-using-the-api-client)
    - [WAF ACL for the API](#waf-acl-for-the-api)
  - [Web Client](#web-client)
    - [Retrieve exsiting web client](#retrieve-exsiting-web-client)
    - [Edit to match server side](#edit-to-match-server-side)
    - [Add a New Page to the Web Client](#add-a-new-page-to-the-web-client)
    - [Web Client Development Cycle](#web-client-development-cycle)
    - [Web Client Language Locale Support](#web-client-language-locale-support)
    - [Deploy the Web Client](#deploy-the-web-client)
  - [Add Security Headers using Lambda@Edge Function](#add-security-headers-using-lambdaedge-function)
  - [Testing and Troubleshooting](#testing-and-troubleshooting)
    - [AWS-Amplify "API not configured" Error](#aws-amplify-api-not-configured-error)
    - [No 'Access-Control-Allow-Origin' header is present on the requested resource](#no-access-control-allow-origin-header-is-present-on-the-requested-resource)
    - [Check API Gateway -> Lambda -> QuickSight-embedded-URL work](#check-api-gateway---lambda---quicksight-embedded-url-work)

## References

- https://docs.aws.amazon.com/quicksight/latest/user/embedded-dashboards-setup.html

## S3 Bucket for the Web Client

Create an S3 bucket for the web client and the origin for a CloudFront distribution.

## CloudFront Distribution

Create a Web CloudFront distribution. Use the default except:

- Origin Domain Name set to the S3 bucket created for the web client
- Origin Path blank
- Restrict Bucket Access Yes
- Create or Use an Existing Identity
- Yes, Update Bucket Policy
- Redirect HTTP to HTTPS
- Allowed HTTP Methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE
- Price Class: choose appropriately for the application
- AWS WAF Web ACL: default to None for now
- CNAMEs: enter if you have a registered domain to use
- SSL Certificate: use one for your domain or Default CloudFront Certificate if using the CloudFront URL and not a registered domain.
- Default Root Object: index.html (assuming that's what your web client uses)
- Logging On
- Bucket for Logs: S3 bucket where you keep logs for the AWS account
- Log Prefix: S3 key prefix for logging. E.g. dashboard-webclient/
- Enable IPv6: may want to disable if plan to add a WAF ACL for white-listed IPs

Wait while the CloudFront distribution is setup. May take 30 minutes or more.

### WAF ACL for CloudFront

To restrict access to the distribution, go to WAF & Shield, Create web ACL

- Web ACL name: name it something appropriate. This ACL will be for the CloudFront distribution. Later we'll make another for the API Gateway.
- Region Global (CloudFront)
- AWS resource to associate: select the CloudFront distribution you just created

## IAM Role for QuickSight Access

In the referenced documentation, you are creating a role for a user to
register with Quicksight and get an embedded URL. The difference here is
that instead of a server application assuming this role, we want a
Lambda to assume this role. We can do this by creating a role with a
trusted relationship.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

IAM, Roles, Create Role for Lambda

- AWS service
- Choose Lambda as the service that will use this role. This will be create the Trusted Relationship with lambda
- Next, Permissions, Create Policy
- JSON for the policy.
  - Set the <Region>, e.g. us-east-1
  - Set the <Account #> matchine the AWS account
  - Set the QuickSight dashboard ARNs for any dashboards you are allowing access. The <dashboard ID> is viewable at the end of the URL of dashboard when viewed in the QuickSight console.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "quicksight:RegisterUser",
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": "quicksight:CreateGroupMembership",
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": "quicksight:GetDashboardEmbedUrl",
            "Resource": [
                "arn:aws:quicksight:us-east-2:766583575416:dashboard/ebfa4039-f87d-41ec-8d39-075715ff650c"
            ],
            "Effect": "Allow"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
```

- Name and create the policy
- Name the role, e.g. lambda_telmex-development-dashboard, create it, and attach the policy
- If encounter "The policy failed legacy parsing" errors when creating the role policy, this may be due to IT configured permission boundaries. However, a role and permission can be created when creating the lambda and the permission edited afterward.

## QuickSight

- In **Manage QuickSight**, **Domains and Embedding**
  - Add the domain of the web application. E.g. https://d14jkd8t33zdl3.cloudfront.net.
    - QuickSight "Domains and Embedding" is per region and you must be in the same region as the dashboards you're sharing.
    - If using the CloudFront domain name, no need to check Include subdomains.
    - Remember to also add the CNAME used by the CloudFront distribution, if one is configured
- Create a QuickSight analysis and publish it as a dashboard
- Using AWS ClI, create a group for dashboard access. For example:

    ```bash
    aws quicksight create-group --aws-account-id 766583575416 --namespace default --group-name caf_development_dashboards --region us-east-1 --profile proservicesaws
    ```

    ```json
    {
        "Status": 201,
        "Group": {
            "Arn": "arn:aws:quicksight:us-east-1:766583575416:group/default/caf_development_dashboards",
            "GroupName": "caf_development_dashboards",
            "PrincipalId": "group/d-906711e6d5/bf3a3a49-4b6a-4c47-be1b-8c2aca6143ea"
        },
        "RequestId": "be2bade4-e009-4b3f-a08c-29a9ba2838a3"
    }
    ```

- Create a single Quicksight user that will be used by the web application's Cognito user pool. This user is a special user associated with a specific IAM role. Example CLI to create this user
  - Use the role ARN with lambda as a trust relationship
  - session-name is the lambda function name
  - email can be a valid email

    ```bash
    aws quicksight register-user --aws-account-id 766583575416 --namespace default --email teamrainmakers@adtran.com --identity-type=IAM --user-role=READER --iam-arn arn:aws:iam::766583575416:role/service-role/lambda_access-dev-dashboards-role-3u6wnllo --session-name lambda_access-dev-dashboards --region us-east-1 --profile proservicesaws
    ```

    aws quicksight register-user --aws-account-id 766583575416 --namespace default --email teamrainmakers@adtran.com --identity-type=IAM --user-role=READER --iam-arn arn:aws:iam::766583575416:role/service-role/lambda_access-dev-dashboards-role-3u6wnllo --session-name lambda_access-dev-dashboards --region us-east-1 --profile proservicesaws

    ```json
    {
        "Status": 201,
        "User": {
            "Arn": "arn:aws:quicksight:us-east-1:766583575416:user/default/lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards",
            "UserName": "lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards",
            "Email": "teamrainmakers@adtran.com",
            "Role": "READER",
            "Active": false,
            "PrincipalId": "federated/iam/AROA3E67RCN4A63GKCKS7:lambda_access-dev-dashboards"
        },
        "RequestId": "28d6e866-afd7-4142-aeb6-dc277ecabb32"
    }
    ```

    This will create a QuickSight user named role-name/session-name Check the user is in QuickSight:

    ```bash
    aws quicksight describe-user --aws-account-id 766583575416 --namespace default --region us-east-1 --profile proservicesaws --user-name lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards
    ```

    ```json
    {
        "Status": 200,
        "User": {
            "Arn": "arn:aws:quicksight:us-east-1:766583575416:user/default/lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards",
            "UserName": "lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards",
            "Email": "teamrainmakers@adtran.com",
            "Role": "READER",
            "Active": true,
            "PrincipalId": "federated/iam/AROA3E67RCN4A63GKCKS7:lambda_access-dev-dashboards"
        },
        "RequestId": "ffff298e-b417-4c7d-abc9-e003a44570a8"
    }
    ```

    Then, share the required dashboards with this user or add this user to a Quicksight group that has been given access to the required dashboards.

    List the current groups:

    ```bash
    aws quicksight list-groups --namespace default --aws-account-id 766583575416 --region us-east-1 --profile proservicesaws
    ```

    ```json
    {
        "Status": 200,
        "GroupList": [
            {
                "Arn": "arn:aws:quicksight:us-east-1:766583575416:group/default/caf_development_dashboards",
                "GroupName": "caf_development_dashboards",
                "PrincipalId": "group/d-906711e6d5/bf3a3a49-4b6a-4c47-be1b-8c2aca6143ea"
            }
        ],
        "RequestId": "7b95acae-8bf3-436b-a6b1-b837d8776b27"
    }
    ```

- Add the user you just created to a group

    ```bash
    aws quicksight create-group-membership --group-name caf_development_dashboards --aws-account-id 766583575416 --namespace default --member-name lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards --region us-east-1 --profile proservicesaws
    ```

    ```json
    {
        "Status": 200,
        "GroupMember": {
            "Arn": "arn:aws:quicksight:us-east-1:766583575416:user/default/lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards",
            "MemberName": "lambda_access-dev-dashboards-role-3u6wnllo/lambda_access-dev-dashboards"
        },
        "RequestId": "5ef72147-60b4-428a-a85d-194c5b7475d6"
    }
    ```

- Share the dashboard with the group you created for dashboard access and any other users/groups you wish. Quicksight searches by email address.

## Lambda

### 

Next, create a Lambda with the name and role used above. This Lambda will get the embedded URL and return it to the web application (usually using an API Gateway that has been restricted to the users of the web application).

Create a Lambda that will use the quicksight SDK to fetch a URL for a dashboard. with the name and role used above.

- Runtime Python 2.7 (because of the boto3 issue)
- Execution role is the role with lambda as a trust relationship that you created, so it has permission to access the dashboards listed in that role
- the API Gateway trigger for the lambda will be added later
- lambda function code:

```python
import json
import boto3
from botocore.exceptions import ClientError

qs = boto3.client('quicksight')
id_type = 'IAM'

def respond(err, res=None):
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,GET',
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": True,
            "Content-Security-Policy": "frame-ancestors 'self'"
        },
    }

def lambda_handler(event, context):
    print(event)
    dashboard_id = None
    aws_id = event['requestContext']['accountId']
    print('aws_id: ', aws_id)
    try:
        dashboard_id = event['pathParameters']['dashboardId']
    except:
        dashboard_id = event["queryStringParameters"]['dashboardId']

    print('dashboard_id: ', dashboard_id)
    get_dashboard = qs.get_dashboard_embed_url(
        AwsAccountId=aws_id,
        DashboardId=dashboard_id,
        IdentityType=id_type
    )
    print('get_dashboard: ', get_dashboard)
    print('EmbedUrl: ', get_dashboard['EmbedUrl'])

    if get_dashboard['Status'] == 200:
        payload = {
            'EmbedUrl': get_dashboard['EmbedUrl']
        }
        return respond(None, payload)
    else:
        return respond({'message': 'Could not get signed url.'})
```

- Save the lambda

Lambda does not always have the most recently published version of
Boto3. This is a fairly new feature; so, the Lambda may require a newer version of Boto3 than provided by default. To get around this create a layer with the latest Boto3 package installed and attach it to the lambda.

- Lambda, Layers, Create layer
  - Name: boto3_1_9_76
  - Compatible runtimes: python2.7
  - Upload the zip file
- Lambda, Functions
  - edit the lambda you created adding the layer you just created and version 1
  - save the lambda

### Lambda lambda_api_gateway_options_response

This lambda may not be needed. It's use to add response headers to the OPTIONS method of the API.

Runtime: Node.js 12.x

```javascript
exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        body: JSON.stringify('Hello from lambda_api_gateway_options_response Lambda!'),
    };
    return response;
};
```

## Cognito, Create a user pool

- Pool name: cafdev-development-dashboards
- Step through settings
  - How do you want your end users to sign in? Example:
    - Username
  - Which standard attributes do you want to require?
    - email
  - Next step
    - Only allow administrators to create users
  - Next step
    - choose MFA Off
    - Don't Create role unless you want to allow SMS messaging
  - Next step
    - REPLY-TO email address set to an administrators email, e.g. teamrainmakers@adtran.com
    - Do you want to send emails through your Amazon SES Configuration?
      - No - Use Cognito (Default)
    - Other customizations can be done at a later time
  - Next step (tags)
    - defaults
  - Next step (remember user's devices)
    - defaults
  - Next step
    - Add an app client
      - Name, e.g. cafdev-development-dashboards-appclient
      - **Uncheck Generate client secret**
      - Create app client
    - Next step
    - Next step
    - Create pool

- Cognito, Manage User Pools
  - Users and groups
    - Create user
      - Username: teamrainmakers
      - Send an invitation to this new user? check Email
      - Temporary Password
      - Phone Number, un-check Mark phone number as verified
      - Email: teamrainmakers@adtran.com
      - Email, Check Mark email as verified

    - The email address you used will receive a verification email containing the temporary password for the new Congnito pool user.

## Cognito, Manage Identity Pools

Using the AWS console, access the Cognito service and select **Manage Identity Pools**. Either **Create new identity pool** or click on an existing identity pool. For an existing identity pool, you can see the Identity Pool ID by clicking on **Sample code**.

- Identity pool name: cafdevdeveloopmentdashboards
- Authenticated providers
  - Cognito
    - User pool ID: us-east-2_ivDgwUc50
    - App client ID: 6fp17oguimr6epghu3ekklqg04
  - Create identity
  - Identify the IAM roles to use with your new identity pool
    - Expand Hide Details to see that it will create Auth and Unauth roles for access to Cognito
    - Allow

The Identity pool ID will be visible in the Sample Code section of the Identity pool:

```javascript
// Initialize the Amazon Cognito credentials provider
CognitoCachingCredentialsProvider credentialsProvider = new CognitoCachingCredentialsProvider(
    getApplicationContext(),
    "us-east-2:911663b5-c59d-4a47-aeb3-367bfbfc93b2", // Identity pool ID
    Regions.US_EAST_2 // Region
);
```

## API Gateway

- API Gateway, Get Started
  - REST
  - New API
  - API name: e.g. cafdev-dashboards
  - Create API

### API Definition

- Create Resource
  - Resource Name: dashboards
  - **Check Enable API Gateway CORS**
- Create Method under /dashboards
  - GET
    - Lambda Function
    - **Check Use Lambda Proxy Integration**
    - Choose the appropriate region
    - Lambda Function: enter the name of the lambda function you created. lambda_access-dev-dashboards, arn:aws:lambda:us-east-2:766583575416:function:lambda_access-dev-dashboards
    - Save and OK
- Create Resource under /dashboards
  - Resource Name dashboardId
  - Resource Path {dashboardId}
  - **Check Enable API Gateway CORS**
  - Create Resource
- Create Method under /(dashboardId)
  - GET
    - Lambda Function
    - **Check Use Lambda Proxy Integration**
    - Choose the appropriate region
    - Lambda Function: enter the name of the lambda function you created. lambda_access-dev-dashboards
    - Save and OK

- Create OPTIONS Method with Lambda for response headers
  - Create Method under /(dashboardId)
    - OPTIONS
      - Lambda Function
      - **Check Use Lambda Proxy Integration**
      - Choose the appropriate region
      - Lambda Function: lambda_api_gateway_options_response
      - Save and OK

- API Gateway, API, Authorizers
  - Create New Authorizer
    - Name cafdev-dashboard-cognito-authorizer
    - Type Cognito
    - Cognito User Pool: select the Cognito user pool you created
    - Token Source: Authorization
        - Authorization as the header name (in the JS client code) to pass the identity or access token that's returned by Amazon Cognito when a user signs in successfully.
    - Token Validation: -leave blank-
    - Create

- API Gateway, API, Resources, Actions, Deploy API
  - Deployment stage: choose or create new one
  - Deploy

- API Gateway, Stages
  - Stage name: dev
  - may create a new stage
  - May configure a WAF ACL for the stage

### Test Using the API Client

API Gateway, Resources

- Select either GET method
- Test (lightning bolt)
  - GET /dashboards/{dashboardId}
    - Path
      - {dashboardId}: \<QuickSight dashboard ID\>
    - Query Strings
      - {dashboardId}: dashboardId=\<QuickSight dashboard ID\>
  - Test

### WAF ACL for the API

To restrict access to the API, go to WAF & Shield, Create web ACL

- Web ACL name: name it something appropriate. This ACL will be for the API. You can't use the same ACL created for the CloudFront distribution.
- Region Global (Regional), select the region where your API is
- AWS resource to associate: API Gateway
- Amazon API Gateway API: select the API
- Stage: select the API stage to apply this ACL

## Web Client

### Retrieve exsiting web client

Get an example web client from GitHub, such as the one we used for DT.

```bash
git clone git@github.adtran.com:SAD/analytics-web-app-using-quicksight.git
```

### Edit to match server side

- src/index.js

Update the Amplify.configure call:

- identityPoolId is viewable at Cognito, Manage Identity Pools, Sample Code
- set region appropriately
- userPoolId is viewable at Cognito, Manage User Pools, Pool ID
- userPoolWebClientId is the App client id viewable in **App clients** for the user pool
- endpoint is viewable in API Gateway Stages for the deployed API as "Invoke URL"
- you can change the endpoint name but you will need to change the scripts that reference the name when fetching endpoints

```javascript
import Amplify, { API, I18n } from 'aws-amplify';

### some unchanged code

Amplify.configure({
  Auth: {
      mandatorySignIn: true,
      identityPoolId: 'us-east-2:911663b5-c59d-4a47-aeb3-367bfbfc93b2', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'us-east-2', // REQUIRED - Amazon Cognito Region
      userPoolId: 'us-east-2_ivDgwUc50', //OPTIONAL - Amazon Cognito User Pool ID
      userPoolWebClientId: '6fp17oguimr6epghu3ekklqg04', //OPTIONAL - Amazon Cognito Web Client ID
  },
  API: {
    endpoints: [
      {
        name: "analytics",
        endpoint: "https://0t0amzagza.execute-api.us-east-2.amazonaws.com/dev",
      }
    ]
  }
});
```

### Add a New Page to the Web Client

- src/pages/*.js

  Add a .js file (copy and edit an existing one) defining the class for the page and containing the QuickSight dashboard ID
  
- src/app.js

  Add an import statement for the .js file you added to the pages directory. Add the new page as a Route path in the Router.

- components/header.js

  This defines the row of menu items at the top of the web app. Add menu items and menu selections to the HTML. The NAVLINK to references the name of the .js file in the pages directory

### Web Client Development Cycle

- 1 time

```bash
npm install

npm install yarn
```

- build cycle

```bash
# build for deployment to S3
yarn build

# test local. Compiles changes dynamically.
yarn start

# update the S3 CloudFront origin for the website
aws s3 sync ./build/ s3://cafdev-dashboard-webclient --profile proservicesaws
```

The script, deploy-build.sh, performs the aws s3 sync command. CloudFront will cache the web content at the edge locations and can take a while to update after deploying the new web client. To speed up the process, you can Invalidate the CloudFront distribution by clicking the distribution, choosing the Invalidations tab and Create Invalidation with the content /* to invalidate everthing from the CloudFront edge for the distribution.

- share the dashboard with the lambda (in QuickSight, search teamrainmakers.adtran.com email)
- edit the IAM policy for the lambda to include the arn for the dashboard

Browser caches can usually be reloaded (not from cache) by doing a Shift-reload.

### Web Client Language Locale Support

The I18n library from aws-amplify provides browser locale translations to other languages.

```javascript
import Amplify, { I18n } from 'aws-amplify';
```

You define a dictionary for each langage translation and use the I18n.get('default text') call in the javascript code to use the dictionaries.

Run the following bash command on the src directory of the web client

```bash
find src -type file -name "*.js" | xargs grep 'I18n.get' | cut -d{ -f2 | cut -d\( -f2 | cut -d\) -f1 | tr "\"" "\'" | sort -u
```

### Deploy the Web Client

Copy the contents of the build directory to S3

## Add Security Headers using Lambda@Edge Function

Reference: [Adding HTTP Security Headers Using Lambda@Edge and Amazon CloudFront](https://aws.amazon.com/blogs/networking-and-content-delivery/adding-http-security-headers-using-lambdaedge-and-amazon-cloudfront/)

Rules for CloudFront Triggers for Lambda Functions:

- You can add triggers only for functions in the US East (N. Virginia) Region.
- You can add triggers only for a numbered version, not for $LATEST or for aliases. Publish the $LATEST changes to your Lambda to create a new numbered version.
- To add triggers, the IAM execution role associated with your Lambda function must be assumable by the service principals lambda.amazonaws.com and edgelambda.amazonaws.com. For more information, Setting IAM Permissions and Roles for Lambda@Edge.

The following Lambda code provides an B- scan evaluation from https://observatory.mozilla.org/. ~~The key issue blocking use of the Content-Security-Policy header is that the webpage uses scripts from stackpath.bootstrapcdn.com but that domain no longer has a valid cerificate. The website needs to be refactored/rewritten to not use that site.~~

```javascript
'use strict';
exports.handler = (event, context, callback) => {

    //Get contents of response
    const response = event.Records[0].cf.response;
    const headers = response.headers;

    //Set new headers 
    headers['strict-transport-security'] = [{key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubdomains; preload'}];
    //headers['content-security-policy'] = [{key: 'Content-Security-Policy', value: "default-src 'self'; style-src 'self' 'unsafe-inline' adtran.css stackpath.bootstrapcdn.com; img-src 'self'; script-src 'self' use.fontawesome.com code.jquery.com cdnjs.cloudflare.com https://cognito-idp.us-east-2.amazonaws.com/'; frame-ancestors 'self'"}];
    headers['x-frame-options'] = [{key: 'X-Frame-Options', value: 'SAMEORIGIN'}];
    headers['x-content-type-options'] = [{key: 'X-Content-Type-Options', value: 'nosniff'}]; 
    headers['referrer-policy'] = [{key: 'Referrer-Policy', value: 'same-origin'}];

    //Return modified response
    callback(null, response);
};
```

## Testing and Troubleshooting

[AWS Amplify API](https://aws-amplify.github.io/amplify-js/api/index.html)

### AWS-Amplify "API not configured" Error

Reference: [AWS Amplify: Using Existing Auth and API Resources](https://dev.to/mtliendo/aws-amplify-using-existing-auth-and-api-resources-30pg)

This error may be a race condition class loading aws-amplify/APIClass and aws-amplify/Amplify where the Amplify.configure call in the index.js client code does not configure API, resulting in a "API not configured" response from the APIClass.prototype.createInstance function. Clues to this error are at https://github.com/aws-amplify/amplify-js/issues/1571. A solution that appears to work is to add import of aws-amplify/API to insure API is class loaded:

```javascript
import Amplify, { API, I18n } from 'aws-amplify';

### some unchanged code

// not needed?
API.configure({
  API: {
    endpoints: [
      {
        name: "analytics",
        endpoint: "https://0t0amzagza.execute-api.us-east-2.amazonaws.com/dev"
      }
    ]
  }
});
```

### No 'Access-Control-Allow-Origin' header is present on the requested resource

Web browser errors that "No 'Access-Control-Allow-Origin' header is present on the requested resource."

Check the response headers (lines starting with <):

```cli
curl -s -v -o /dev/null https://d14jkd8t33zdl3.cloudfront.net
curl -s -v -o /dev/null -H 'Origin: http://www.example.com' https://d14jkd8t33zdl3.cloudfront.net
```

References:

- [Enabling cross-origin resource sharing (CORS)](https://docs.aws.amazon.com/AmazonS3/latest/dev/ManageCorsUsing.html)
- [How do I resolve the "No 'Access-Control-Allow-Origin' header is present on the requested resource" error from CloudFront?](https://aws.amazon.com/premiumsupport/knowledge-center/no-access-control-allow-origin-error/)
The CloudFront distribution needs to be setup to include the header in the web replies so that web browsers will allow the client code to call the API gateway URL and subsequent call to retrieve the QuickSight dashboard. This may be done in two ways:

1. Configure CORS for the S3 Bucket and CloudFront to Forward Headers

    - Configure CORS for the S3 Bucket

      Referemce: [Cross-origin resource sharing (CORS)](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html#how-do-i-enable-cors)

      The following rule allows cross-origin GET requests from all origins. The * wildcard character refers to all origins.

      ```xml
      <?xml version="1.0" encoding="UTF-8"?>
      <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
      <CORSRule>
          <AllowedOrigin>*</AllowedOrigin>
          <AllowedMethod>GET</AllowedMethod>
          <AllowedMethod>HEAD</AllowedMethod>
          <AllowedHeader>*</AllowedHeader>
      </CORSRule>
      </CORSConfiguration>
      ```

    - Configure CloudFront to Forward Headers

      Reference: [Enabling cross-origin resource sharing (CORS)](https://docs.aws.amazon.com/AmazonS3/latest/dev/ManageCorsUsing.html)

      After you set up CORS on your origin, configure your CloudFront distribution to forward the headers that are required by your origin. If your origin is an S3 bucket, configure your distribution to forward the appropriate headers to Amazon S3:

      1. Open your distribution from the CloudFront console.
      2. Choose the Behaviors tab.
      3. Choose Create Behavior, or choose an existing behavior, and then choose Edit.
      4. For Cache Based on Selected Request Headers, choose Whitelist.
      5. Under Whitelist Headers, choose headers from the menu on the left, and then choose Add.
         - Access-Control-Request-Headers
         - Access-Control-Request-Method
         - Origin
         - Authorization
      6. Choose Yes, Edit.

2. Create a Lambda at Edge function to add the headers



### Check API Gateway -> Lambda -> QuickSight-embedded-URL work
