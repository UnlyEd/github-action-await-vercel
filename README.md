# Await Vercel deployment

## Why ?
Just like you, we are using Vercel to deploy our apps because that's just so powerful. In our workflow, we run [end-to-end tests](https://www.cypress.io/) on the production URL, to make sure than everything is working.

We got a painfull problem : "Okay, my url is assigned but the code is not deploy yet". Indeed, we don't want to start tests right now, we want the deployment to be fully ready.

## Should I use this action ?
You should **ONLY** be using this action if you have to work with a fully deployed domain.

In fact, this action also returns details about the deployment, so it can avoid you to call the vercel API.

## How ?
To make sure than everything is deploy, we just ask to vercel the **state** of the build.
The workflow is really easy. Please check the **getting start** section.


# Getting start
In this section, we will describe you each options you can use.
## Options
Name | Required | Description
---  | --- |---
url-to-wait|X|Deployment url (not production) or any url working with this endpoint: https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment
timeout| |Timeout before throwing an error (default: 10seconds)

## Environment
We advise you to declare this variable as an **[encrypted secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)**

Name | Description
--- | ---
VERCEL_TOKEN | Obviously we need a [vercel token](https://vercel.com/account/tokens) to query there API and get deployment informations. I swear, we are only using it to GET informations.

## Example
We all know how an example is much better than any documentation.

**NOTICE** I assume you already have the deployment url. We will be working on an action to retrieve it soon... 
```yaml
on:
  pull_request:
  push:
    branches:
      - main

jobs:
  wait-for-vercel-deployment:
    runs-on: ubuntu-latest
    steps:
      - name: "Retrieve deployment URL"
        run: "echo VERCEL_DEPLOYMENT_URL=nrn-v2-mst-aptd-gcms-lcz-sty-c1-hfq88g3jt.vercel.app >> $GITHUB_ENV" # This JUST AN EXAMPLE
      - uses: UnlyEd/github-action-await-vercel:1.0.0
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEl_TOKEN }}
        with:
          url-to-wait: ${{ env.VERCEL_DEPLOYMENT_URL }}
          timeout: 10
```