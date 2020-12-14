<a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" align="right" height="20" alt="Unly logo" title="Unly logo" /></a>
[![Maintainability](https://api.codeclimate.com/v1/badges/c0cb5c0cecadfb391a1a/maintainability)](https://codeclimate.com/github/UnlyEd/github-action-await-vercel/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/c0cb5c0cecadfb391a1a/test_coverage)](https://codeclimate.com/github/UnlyEd/github-action-await-vercel/test_coverage)

![GitHub Action integration test](https://github.com/UnlyEd/github-action-await-vercel/workflows/GitHub%20Action%20integration%20test/badge.svg)
![GitHub Action build test](https://github.com/UnlyEd/github-action-await-vercel/workflows/GitHub%20Action%20build%20test/badge.svg)
![Update Code Climate test coverage](https://github.com/UnlyEd/github-action-await-vercel/workflows/Update%20Code%20Climate%20test%20coverage/badge.svg)

# GitHub Action - Await for a Vercel deployment (to be ready)

## Code snippet example (minimal example)

```yaml
jobs:
  wait-for-vercel-deployment:
    runs-on: ubuntu-latest
    steps:
      - uses: UnlyEd/github-action-await-vercel@v1.0.0
        id: await-vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        with:
          deployment-url: nrn-v2-mst-aptd-gcms-lcz-sty-c1-hfq88g3jt.vercel.app
          timeout: 10 # Wait for 10 seconds before failing

      - name: Display deployment status
        run: "echo My deployment is ${{ fromJson(steps.await-vercel.outputs.deploymentDetails).readyState }}"
```

_See the [Examples section](#examples) for more advanced examples._

## What does this GitHub Action do?
It waits until a Vercel deployment is marked as "ready". _(See [`readyState === 'READY'`](https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment/response-parameters))_

## Why/when should you use it?
If you're using Vercel to deploy your apps and you use some custom deployment pipeline using GitHub Actions, 
you might need to wait for a deployment to be ready before running other processes (e.g: Your end-to-end tests using [Cypress](https://www.cypress.io/)).

For instance, if you don't wait for the deployment to be ready, 
then you might sometimes run your E2E tests suite against the Vercel's login page, instead of your actual deployment.

If your GitHub Actions sometimes succeeds but sometimes fails, then you probably need to use this action, 
which will wait until the Vercel deployment is really ready, before starting your next GitHub Action step.

## What else does this action do?
This action automatically forwards the Vercel API response, which contains [additional information about the deployment](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters).
This can be quite helpful if you need them, and will avoid for you to have yet to make another call to the Vercel API. It's done for you! :tada:

## Getting started
To get started with this GitHub Action, you'll need:
- To configure a Vercel secret, for the GitHub Action to be authorized to fetch your deployments
- To provide a few required options (like, the domain)

### GitHub project configuration
You must declare those variables as **[GitHub Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)**.

Name | Description
--- | ---
`VERCEL_TOKEN` | Your [vercel token](https://vercel.com/account/tokens) is required to fetch the Vercel API on your behalf and get the status of your deployment. [See usage in code](https://github.com/UnlyEd/github-action-await-vercel/search?q=VERCEL_TOKEN)

### Action's API

#### Inputs
Name | Required | Default | Description
---  | --- |--- |---
`deployment-url`|✅| |Deployment domain (e.g: `my-app-hfq88g3jt.vercel.app`)
`timeout`|✖️|`10`|Duration (in seconds), until the action fails

#### Outputs
This action forwards the [Vercel API response](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters) as return value.

Name | Description
--- | ---
`deploymentDetails` | [JSON object](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters). You can also use our [TS type](./blob/main/src/types/VercelDeployment.ts).

## Examples
In the below example, we show you how to:

1. Step 1: Forward `VERCEL_DEPLOYMENT_URL` as an ENV variable, using ` >> $GITHUB_ENV"` which stores the value into the GitHub Actions env vars.
    Of course, you might do it differently. It doesn't really matter as long as `VERCEL_DEPLOYMENT_URL` is set.
1. Step 2: Then, we use the `UnlyEd/github-action-await-vercel@v1.0.0` GitHub Action, which waits for the deployment url to be ready.
1. Step 3: Finally, we show an example on how to read the deployment's information returned by the Vercel API (which have been forwarded).

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
      - name: Retrieve deployment URL (example on how to set an ENV var)
        run: "echo VERCEL_DEPLOYMENT_URL=nrn-v2-mst-aptd-gcms-lcz-sty-c1-hfq88g3jt.vercel.app >> $GITHUB_ENV"

      - uses: UnlyEd/github-action-await-vercel@v1.0.0
        id: await-vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        with:
          deployment-url: ${{ env.VERCEL_DEPLOYMENT_URL }}
          timeout: 10 # Wait for 10 seconds before failing

      - name: Displays the deployment name (example on how to read information about the deployment)
        run: "echo My deployment is ${{ fromJson(steps.await-vercel.outputs.deploymentDetails).name }}"
```

Check the documentation to see what information [`deploymentDetails`](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters) contains.

# Debugging the Action - How to enable logs within `github-action-await-vercel` action?
Our GitHub Action is written using the GitHub Actions native [`core.debug` API](https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs).

Therefore, it allows you to enable logging whenever you need to debug **what's happening within our action**.

**To enable debug mode**, you have to set a GitHub [**secret**](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets), such as:
- `ACTIONS_STEP_DEBUG` of value `true`

Please see [the official documentation](https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#how-to-access-step-debug-logs) for more information.

---

# Contributing

We gladly accept PRs, but please open an issue first, so we can discuss it beforehand.

## Working locally

### Configuring local tests
You'll need to create a `.env.test` file based on `.env.test.example`.
Then, you'll need to create and add your own Vercel token there (`VERCEL_TOKEN`).

This is required because local tests rely on `VERCEL_TOKEN`. 
_(While integration tests on GitHub rely on the GitHub secret `VERCEL_TOKEN` instead)_

---

# License
[MIT](./LICENSE)

---

# Vulnerability disclosure

[See our policy](https://github.com/UnlyEd/Unly).

---

# Contributors and maintainers

This project is being authored by:

- [Unly] Ambroise Dhenain ([Vadorequest](https://github.com/vadorequest)) **(active)**
- Hugo Martin ([Demmonius](https://github.com/demmonius)) **(active)**

---

# **[ABOUT UNLY]** <a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" height="40" align="right" alt="Unly logo" title="Unly logo" /></a>

> [Unly](https://unly.org) is a socially responsible company, fighting inequality and facilitating access to higher education.
> Unly is committed to making education more inclusive, through responsible funding for students.

We provide technological solutions to help students find the necessary funding for their studies.

We proudly participate in many TechForGood initiatives. To support and learn more about our actions to make education accessible, visit :

- https://twitter.com/UnlyEd
- https://www.facebook.com/UnlyEd/
- https://www.linkedin.com/company/unly
- [Interested to work with us?](https://jobs.zenploy.io/unly/about)

Tech tips and tricks from our CTO on our [Medium page](https://medium.com/unly-org/tech/home)!

# TECHFORGOOD #EDUCATIONFORALL
