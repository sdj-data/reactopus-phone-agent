#!/bin/bash

# Reactopus Voice Agent - Amazon Connect Setup Script
# This script sets up the Amazon Connect instance and contact flow

set -e

echo "🚀 Setting up Amazon Connect for Reactopus Voice Agent..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

# Get AWS account ID and region
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION=$(aws configure get region)

if [ -z "$REGION" ]; then
    print_warning "No default region set. Using us-east-1"
    REGION="us-east-1"
fi

print_status "Using AWS Account: $ACCOUNT_ID"
print_status "Using AWS Region: $REGION"

# Step 1: Create Amazon Connect instance
print_status "Creating Amazon Connect instance..."

INSTANCE_ALIAS="ReactopusVoiceAgentDev"

# Check if instance already exists
if aws connect list-instances --query "InstanceSummaryList[?InstanceAlias=='$INSTANCE_ALIAS'].Id" --output text | grep -q .; then
    print_warning "Amazon Connect instance '$INSTANCE_ALIAS' already exists."
    INSTANCE_ID=$(aws connect list-instances --query "InstanceSummaryList[?InstanceAlias=='$INSTANCE_ALIAS'].Id" --output text)
else
    # Create the instance
    INSTANCE_RESULT=$(aws connect create-instance \
        --identity-management-config '{"IdentityManagementType":"CONNECT_MANAGED"}' \
        --instance-alias "$INSTANCE_ALIAS" \
        --inbound-calls-enabled \
        --outbound-calls-enabled)
    
    INSTANCE_ID=$(echo $INSTANCE_RESULT | jq -r '.Id')
    print_status "Created Amazon Connect instance with ID: $INSTANCE_ID"
fi

# Wait for instance to be active
print_status "Waiting for instance to be active..."
aws connect describe-instance --instance-id "$INSTANCE_ID" --query 'Instance.InstanceStatus' --output text

# Step 2: Get the Lambda function ARN (assuming it's deployed via Amplify)
print_status "Looking for handleIncomingCall Lambda function..."

# Try to find the Lambda function
LAMBDA_FUNCTION_NAME=$(aws lambda list-functions \
    --query "Functions[?contains(FunctionName, 'handleIncomingCall')].FunctionName" \
    --output text | head -1)

if [ -z "$LAMBDA_FUNCTION_NAME" ]; then
    print_error "Lambda function 'handleIncomingCall' not found. Please deploy your Amplify app first."
    print_status "Run: npx amplify push"
    exit 1
fi

LAMBDA_ARN=$(aws lambda get-function --function-name "$LAMBDA_FUNCTION_NAME" --query 'Configuration.FunctionArn' --output text)
print_status "Found Lambda function: $LAMBDA_FUNCTION_NAME"
print_status "Lambda ARN: $LAMBDA_ARN"

# Step 3: Update contact flow JSON with actual Lambda ARN
print_status "Updating contact flow with Lambda ARN..."

# Create a temporary contact flow file with the actual ARN
cp contact-flow.json contact-flow-temp.json

# Replace placeholders in the contact flow
sed -i.bak "s/REGION/$REGION/g" contact-flow-temp.json
sed -i.bak "s/ACCOUNT_ID/$ACCOUNT_ID/g" contact-flow-temp.json
sed -i.bak "s/FUNCTION_NAME/$LAMBDA_FUNCTION_NAME/g" contact-flow-temp.json

# Step 4: Create the contact flow
print_status "Creating contact flow..."

CONTACT_FLOW_RESULT=$(aws connect create-contact-flow \
    --instance-id "$INSTANCE_ID" \
    --name "VoiceAgentFlow" \
    --type "CONTACT_FLOW" \
    --content file://contact-flow-temp.json)

CONTACT_FLOW_ID=$(echo $CONTACT_FLOW_RESULT | jq -r '.ContactFlowId')
CONTACT_FLOW_ARN=$(echo $CONTACT_FLOW_RESULT | jq -r '.ContactFlowArn')

print_status "Created contact flow with ID: $CONTACT_FLOW_ID"

# Step 5: Grant Connect permission to invoke Lambda
print_status "Granting Amazon Connect permission to invoke Lambda function..."

aws lambda add-permission \
    --function-name "$LAMBDA_FUNCTION_NAME" \
    --statement-id "ConnectInvoke" \
    --action "lambda:InvokeFunction" \
    --principal "connect.amazonaws.com" \
    --source-arn "$CONTACT_FLOW_ARN" \
    2>/dev/null || print_warning "Permission may already exist"

# Step 6: Publish the contact flow
print_status "Publishing contact flow..."

aws connect publish-contact-flow-version \
    --instance-id "$INSTANCE_ID" \
    --contact-flow-id "$CONTACT_FLOW_ID"

# Clean up temporary file
rm -f contact-flow-temp.json contact-flow-temp.json.bak

# Step 7: Display setup information
print_status "✅ Setup completed successfully!"
echo
print_status "📋 Setup Summary:"
echo "Instance ID: $INSTANCE_ID"
echo "Instance Alias: $INSTANCE_ALIAS"
echo "Contact Flow ID: $CONTACT_FLOW_ID"
echo "Lambda Function: $LAMBDA_FUNCTION_NAME"
echo "Lambda ARN: $LAMBDA_ARN"
echo
print_status "🔗 Next Steps:"
echo "1. Log into the Amazon Connect admin portal to claim a phone number"
echo "2. Associate the phone number with the 'VoiceAgentFlow' contact flow"
echo "3. Test the setup by calling the assigned number"
echo
print_status "📞 Amazon Connect Admin URL:"
echo "https://$INSTANCE_ALIAS.my.connect.aws/connect/home"