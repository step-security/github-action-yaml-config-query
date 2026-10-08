[![StepSecurity Maintained Action](https://raw.githubusercontent.com/step-security/maintained-actions-assets/main/assets/maintained-action-banner.png)](https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions)

<!-- markdownlint-disable -->

<p align="right"><a href="https://github.com/step-security/github-action-yaml-config-query/releases/latest"><img src="https://img.shields.io/github/release/step-security/github-action-yaml-config-query.svg?style=for-the-badge" alt="Latest Release"/></a><a href="https://github.com/step-security/github-action-yaml-config-query/commits"><img src="https://img.shields.io/github/last-commit/step-security/github-action-yaml-config-query.svg?style=for-the-badge" alt="Last Updated"/></a>

</p>
<!-- markdownlint-restore -->

Define YAML document, filter it with JSON query and get result as outputs

## Introduction

Utility action allow to declare YAML structured document as an input and get
it's part as the action outputs referenced using JQ.

This action is useful in simplifing complext GitHub action workflows in
different ways. For examples follow [usage](#usage) section.

## Migration `v0` to `v1`

There is an issue
[The query contains `true` or `false` fails with an error](https://github.com/alexxander/jq-tools/issues/4).
A workaround is to use a quote around `"true" and `"false" in a query.

To migrate from `v0` to `v1`, quote in your queries all `true`/`false` and
Github actions substitutions resovled to the values.

### Example

- `query: .true` replace with `query: ."true"`
- `query: .${{ inputs.from == '' }}` replace with
  `query: ."${{ inputs.from == '' }}"`

## Usage

### Define constants

```yaml
  name: Pull Request
  on:
    pull_request:
      branches: [ 'main' ]
      types: [opened, synchronize, reopened, closed, labeled, unlabeled]

  jobs:
    demo:
      runs-on: ubuntu-latest
      steps:
        - name: Context
          id: context
          uses: step-security/github-action-yaml-config-query@v1
          with:
            config: |
              image: acme/example
              tag: sha-${{ github.sha }}

        - run: |
          docker run ${{ steps.context.outputs.image }}:${{ steps.context.outputs.tag }}
```

### Implement if/else

```yaml
  name: Promote
  on:
    workflow_call:
      inputs:
        from:
          required: false
          type: string

  jobs:
    demo:
      runs-on: ubuntu-latest
      steps:
        - name: Context
          id: from
          uses: step-security/github-action-yaml-config-query@v1
          with:
            query: ."${{ inputs.from == '' }}"
            config: |-
              true:
                tag: ${{ github.sha }}
              false:
                tag: ${{ inputs.from }}

        - run: |
          docker tag acme/example:${{ steps.context.outputs.tag }}
```

### Implement switch

```yaml
name: Build
on:
  pull_request:
    branches: ['main']
    types: [opened, synchronize, reopened]
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  context:
    runs-on: ubuntu-latest
    steps:
      - name: Context
        id: controller
        uses: step-security/github-action-yaml-config-query@v1
        with:
          query: .${{ github.event_name }}
          config: |-
            pull_request: 
              build: true
              promote: false
              test: true
              deploy: ["preview"]
            push:
              build: true
              promote: false  
              test: true
              deploy: ["dev"]
            release:
              build: false
              promote: true
              test: false
              deploy: ["staging", "production"]
    outputs:
      build: ${{ steps.controlle.outputs.build }}
      promote: ${{ steps.controlle.outputs.promote }}
      test: ${{ steps.controlle.outputs.test }}
      deploy: ${{ steps.controlle.outputs.deploy }}

  build:
    needs: [context]
    if: ${{ needs.context.outputs.build }}
    uses: ./.github/workflows/reusable-build.yaml

  test:
    needs: [context, test]
    if: ${{ needs.context.outputs.test }}
    uses: ./.github/workflows/reusable-test.yaml

  promote:
    needs: [context]
    if: ${{ needs.context.outputs.promote }}
    uses: ./.github/workflows/reusable-promote.yaml

  deploy:
    needs: [context]
    if: ${{ needs.context.outputs.deploy != '[]' }}
    strategy:
      matrix:
        environment: ${{ fromJson(needs.context.outputs.deploy) }}
    uses: ./.github/workflows/reusable-deploy.yaml
    with:
      environment: ${{ matrix.environment }}
```

## Inputs

<!-- markdownlint-disable -->

| Name   | Description | Default | Required |
| ------ | ----------- | ------- | -------- |
| config | YAML config | N/A     | true     |
| query  | JQ Query    | .       | true     |

<!-- markdownlint-restore -->

## References

For additional context, refer to some of these links.

- [github-actions-workflows](https://github.com/cloudposse/github-actions-workflows) -
  Reusable workflows for different types of projects
- [example-github-action-release-workflow](https://github.com/cloudposse/example-github-action-release-workflow) -
  Example application with complicated release workflow

For 🐛 bug reports & feature requests, please use the
[issue tracker](https://github.com/step-security/github-action-yaml-config-query/issues).

Complete license is available in the [`LICENSE`](LICENSE) file.

```text
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
```

</details>

## Trademarks

All other trademarks referenced herein are the property of their respective
owners.

---

Copyright © 2017-2026 [Cloud Posse, LLC](https://cpco.io/copyright)

Copyright © 2026 [StepSecurity](https://stepsecurity.io)

<a href="https://cloudposse.com/readme/footer/link?utm_source=github&utm_medium=readme&utm_campaign=step-security/github-action-yaml-config-query&utm_content=readme_footer_link"><img alt="README footer" src="https://cloudposse.com/readme/footer/img"/></a>

<img alt="Beacon" width="0" src="https://ga-beacon.cloudposse.com/UA-76589703-4/step-security/github-action-yaml-config-query?pixel&cs=github&cm=readme&an=github-action-yaml-config-query"/>
