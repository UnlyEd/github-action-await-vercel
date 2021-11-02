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
    runs-on: ubuntu-18.04
    steps:
      - uses: UnlyEd/github-action-await-vercel@v1.2.14
        id: await-vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        with:
          deployment-url: nextjs-bzyss249z.vercel.app # TODO Replace by the domain you want to test
          timeout: 10 # Wait for 10 seconds before failing

      - name: Display deployment status
        run: "echo The deployment at ${{ fromJson(steps.await-vercel.outputs.deploymentDetails).url }} is ${{ fromJson(steps.await-vercel.outputs.deploymentDetails).readyState }}"
```

_See the [Examples section](#examples) for more advanced examples._

## What does this GitHub Action do?
It waits until a Vercel deployment domain is marked as "READY". _(See [`readyState === 'READY'`](https://vercel.com/docs/api#endpoints/deployments/create-a-new-deployment/response-parameters))_

You must know the domain url you want to await for and provide it as `deployment-url` input.

## Why/when should you use it?
If you're using Vercel to deploy your apps, and you use some custom deployment pipeline using GitHub Actions, 
you might need to wait for a deployment to be ready before running other processes _(e.g: Your end-to-end tests using [Cypress](https://www.cypress.io/))_.

> For instance, if you don't wait for the deployment to be ready, 
then you might sometimes run your E2E tests suite against the Vercel's login page, instead of your actual deployment.

If your GitHub Actions sometimes succeeds but sometimes fails, then you probably need to await for the domain to be ready. 
This action might help doing so, as it will wait until the Vercel deployment is really ready, before starting your next GitHub Action step.

## What else does this action do?
This action automatically forwards the Vercel API response, which contains [additional information about the deployment](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters).
This can be quite helpful if you need them, and will avoid for you to have yet to make another call to the Vercel API.

## Considered alternatives

### 1. [`wait-for-vercel`](https://github.com/mskelton/wait-for-vercel-action)

Before building our own GitHub Action, we tried using [`wait-for-vercel`](https://github.com/mskelton/wait-for-vercel-action), but it didn't handle our use case properly.

Part of the issue is that it fetches **all deployments for a team/project**, which leads to **extra issues when you have multiple deployments running in parallel**. _(as it won't necessarily fetch the domain you expect, it's a bit random when multiple deployments are running in parallel)_

> **If you are/were using `wait-for-vercel`**, please note `github-action-await-vercel` works slightly differently, as it requires the `deployment-url` input, while `wait-for-vercel` didn't.
> But this ensures you await for the proper domain to be deployed, and is safe, even when multiple deployments are running in parallel.

## Getting started
To get started with this GitHub Action, you'll need:
- To configure a Vercel secret, for the GitHub Action to be authorized to fetch your deployments
- To provide a few required options (like, the domain you want to await for)

### GitHub project configuration
You should declare those variables as **[GitHub Secrets](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)**.

Name | Description
--- | ---
`VERCEL_TOKEN` | Your [vercel token](https://vercel.com/account/tokens) is required to fetch the Vercel API on your behalf and get the status of your deployment. [See usage in code](https://github.com/UnlyEd/github-action-await-vercel/search?q=VERCEL_TOKEN)

> _**N.B**: You don't have to use a GitHub Secret to provide the `VERCEL_TOKEN`. But you should do so, as it's a good security practice, because this way the token will be [hidden in the logs (encrypted)](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)._ 

### Action's API

#### Inputs
Name | Required | Default | Description
---  | --- |--- |---
`deployment-url`|✅| |Deployment domain (e.g: `my-app-hfq88g3jt.vercel.app`, `my-app.vercel.app`, etc.).
`timeout`|✖️|`10`|How long (in seconds) the action waits for the deployment status to reach either `READY` or `ERROR` state.

> **Tip**: You might want to adapt the `timeout` to your use case.
> - For instance, if you're calling this action **right after having triggered the Vercel deployment**, then it'll go through `INITIALIZING > ANALYZING > BUILDING > DEPLOYING` phases before reaching `READY` or `ERROR` state.
> This might take quite some time (depending on your project), and increasing the timeout to `600` (10mn) (or similar) is probably what you'll want to do in such case, because you need to take into account the time it'll take for Vercel to deploy.
> - The default of `10` seconds is because we _assume_ you'll call this action after the deployment has reached `BUILDING` state, and the time it takes for Vercel to reach `READY` or `ERROR` from `BUILDING` is rather short.

#### Outputs
This action forwards the [Vercel API response](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters) as return value.

Name | Description
--- | ---
`deploymentDetails` | [JSON object](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters). You can also use our [TS type](./blob/main/src/types/VercelDeployment.ts).

## Examples

### 1. Manually set a hardcoded Vercel deployment url as `deployment-url` (as GitHub env variable)
In the below example, we show you how to:

1. **Step 1**: Forward `VERCEL_DEPLOYMENT_URL` as an ENV variable, using ` >> $GITHUB_ENV"` which stores the value into the GitHub Actions env vars.
    Of course, you might do it differently. It doesn't really matter as long as `VERCEL_DEPLOYMENT_URL` is set.
1. **Step 2**: Then, we use the `UnlyEd/github-action-await-vercel@v1.2.14` GitHub Action, which waits for the deployment url to be ready.
1. **Step 3**: Finally, we show an example on how to read the deployment's information returned by the Vercel API (which have been forwarded).

```yaml
on:
  pull_request:
  push:
    branches:
      - main

jobs:
  wait-for-vercel-deployment:
    runs-on: ubuntu-18.04
    steps:
      - name: Retrieve deployment URL (example on how to set an ENV var)
        run: "echo VERCEL_DEPLOYMENT_URL=nextjs-bzyss249z.vercel.app >> $GITHUB_ENV"

      - uses: UnlyEd/github-action-await-vercel@v1.2.14
        id: await-vercel
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
        with:
          deployment-url: ${{ env.VERCEL_DEPLOYMENT_URL }}
          timeout: 10 # Wait for 10 seconds before failing

      - name: Displays the deployment name (example on how to read information about the deployment)
        run: "echo The deployment at ${{ fromJson(steps.await-vercel.outputs.deploymentDetails).url }} is ${{ fromJson(steps.await-vercel.outputs.deploymentDetails).readyState }}"
```

Check the documentation to see what information [`deploymentDetails`](https://vercel.com/docs/api#endpoints/deployments/get-a-single-deployment/response-parameters) contains.

### 2. Dynamically resolve the Vercel deployment url 

This is a real-world use case example, from [Next Right Now](https://github.com/UnlyEd/next-right-now).

The workflow is a bit more complicated:
1. All Vercel deployments for the team are fetched dynamically.
1. Then the latest deployment url is extracted and used as `deployment-url` input by `github-action-await-vercel`.
1. Once the deployment is ready, the `run-2e2-tests` job is started (using Cypress).

[See code](https://github.com/UnlyEd/next-right-now/blob/v4.0.12-v2-mst-aptd-at-lcz-sty/.github/workflows/deploy-vercel-staging.yml#L174-L236)

---

# Advanced debugging

> Learn how to enable logging, from within the `github-action-await-vercel` action.

## How to enable debug logs

Our GitHub Action is written using the GitHub Actions native [`core.debug` API](https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#step-debug-logs).

Therefore, it allows you to enable logging whenever you need to debug **what's happening within our action**.

**To enable debug mode**, you have to set a [**GitHub Secret**](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets#creating-encrypted-secrets), such as:

- `ACTIONS_STEP_DEBUG` of value `true`

Please see [the official documentation](https://github.com/actions/toolkit/blob/main/docs/action-debugging.md#how-to-access-step-debug-logs) for more information.

> Enabling debugging using `ACTIONS_STEP_DEBUG` will also enable debugging for all other GitHub Actions you use that are using the `core.debug` API.

---

# Contributing

We gladly accept PRs, but please open an issue first, so we can discuss it beforehand.

## Working locally

### Configuring local tests
You'll need to create a `.env.test` file based on `.env.test.example`.
Then, you'll need to create and add your own Vercel token there (`VERCEL_TOKEN`), and change the `VERCEL_DOMAIN` being tested to a domain you own (any Vercel domain will do).

> Local tests rely on the **environment variable** `VERCEL_TOKEN`, and must use your own Vercel account and credentials.
>
> Integration tests (on GitHub) rely on the **GitHub secret** `VERCEL_TOKEN` instead, and use a dedicated Vercel account.

---

# Changelog

[Changelog](./CHANGELOG.md)

---

# Releases versioning

We follow Semantic Versioning. (`major.minor.patch`)

Our versioning process is completely automated, any changes landing on the `main` branch will trigger a new [release](../../releases).

- `MAJOR`: Behavioral change of the existing API that would result in a breaking change.
  - E.g: Removing an input, or changing the output would result in a breaking change and thus would be released as a new MAJOR version.
- `Minor`: Behavioral change of the existing API that would **not** result in a breaking change.
  - E.g: Adding an optional input would result in a non-breaking change and thus would be released as a new Minor version.
- `Patch`: Any other change.
  - E.g: Documentation, tests, refactoring, bug fix, etc.

## Releases versions:

- We do not provide major versions that are automatically updated (e.g: `v1`).
- We only provide tags/releases that are not meant to be changed once released (e.g: `v1.1.0`).

> As utility, we provide a special [`latest`](../../releases/tag/latest) tag which is automatically updated to the latest release.
> _This tag/release is **not meant to be used in production systems**, as it is not reliable (might jump to the newest MAJOR version at any time)._

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
