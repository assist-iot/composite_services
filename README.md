# Composite services manager
[![CreatedBy](https://img.shields.io/badge/created%20by-ASSIST%20IoT-blue.svg)](https://assist-iot.eu)
[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](https://opensource.org/licenses/Apache-2.0)
[![Website](https://img.shields.io/website?url=https://assist-iot.eu)](https://assist-iot.eu)
[![Read the Docs](https://img.shields.io/readthedocs/assist-iot-enablers-documentation)](https://assist-iot-enablers-documentation.readthedocs.io/en/latest/verticals/manageability/management_of_services_and_enablers.html)
[![Docker Image Version](https://img.shields.io/docker/v/assistiot/composite-services-manager_core)](https://hub.docker.com/r/assistiot/composite-services-manager_core)
[![Website](https://img.shields.io/endpoint?url=https://artifacthub.io/badge/repository/assist-iot-composite-services)](https://artifacthub.io/packages/search?repo=assist-iot-composite-services&sort=relevance&page=1)

In this repository is included the **Composite services manager** enabler of the ASSIST-IoT Manageability enablers. The other two manageability enablers (Enablers manager and Clusters and topology manager) can be found in [this repository](https://github.com/assist-iot/managability_enablers).

## Repository structure
This repository is structured in 4 folders:

- **agents**: code and Helm charts of each agent (HTTP-MQTT and MQTT-HTTP).
- **core**: code of the core component of the enabler.
- **helm-chart**: Helm chart of the enabler itself (core and Node-RED, without the agents).
- **node-red**: custom Node-RED for the enabler, which is used as the frontend part of it. This folder also includes the [custom Node-RED nodes](https://github.com/assist-iot/composite_services/tree/main/node-red/node-red-nodes), which are publicly available in the [Node-RED Flow Library](https://flows.nodered.org/node/@ravaga/assistiot-composite-services-manager).

## Documentation
An extended documentation of the enabler is available in the [official ASSIST-IoT documentation](https://assist-iot-enablers-documentation.readthedocs.io/en/latest/verticals/manageability/management_of_services_and_enablers.html), which is in *Read the Docs* format.
