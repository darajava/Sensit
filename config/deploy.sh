#!/bin/bash
if [ $1 == 'prelive' ]
then
  . .env.prelive
  BRANCH=prelive
  ENVIRONMENT=prelive
fi

if [ $1 == 'staging' ]
then
  . .env.staging
  BRANCH=staging
  ENVIRONMENT=staging
fi

if [ $1 == 'production' ]
then
  . .env.production
  BRANCH=production
  ENVIRONMENT=production
fi

# make sure to only commit correct branch per env
git checkout $BRANCH

# check if working directoy is clean
if [ -z "$(git status --porcelain)" ]; then
  # Working directory clean
  echo 'working directory clean'
else
  # Uncommitted changes
  echo 'Error: You have uncommitted changes in this branch'
  echo 'Commit these and try to deploy again'
  exit
fi

# get git hash info
CURR_COMMIT=$(git rev-parse HEAD);
CURR_VERSION=$(node -e "console.log(require('./package.json').version);");
VER_HASH=$(git rev-list -n 1 v$CURR_VERSION);

echo "current commit hash: "
echo $CURR_COMMIT
echo "Version hash: "
echo $VER_HASH

# Don't want to redo version bump
if [ "$CURR_COMMIT" == "$VER_HASH" ]
then
    echo 'Already up to date'
    echo 'We can only deploy if there are changes to the project'
    exit
fi

# if environment is production - bump the node version number
if [ "$ENVIRONMENT" == 'live' ]
then
  npm version patch;
  NEW_VERSION=$(node -e "console.log(require('./package.json').version);");
  DATE = $(date)
  MESSAGE = 'Deployed: '
  git add -A .
  git push origin --tags
fi

echo $NEW_VERSION;
echo "env ===== "
echo $ENVIRONMENT
echo $REACT_APP_BUCKET
# build the app in specified environment
npm run build:$ENVIRONMENT

# sync build folder with s3 bucket
aws s3 sync ./build s3://$REACT_APP_BUCKET --acl public-read --delete;

# Invalidate cache
aws cloudfront create-invalidation --distribution-id $REACT_APP_CLOUDFRONT_DISTRIBUTION_ID --paths "/*";
