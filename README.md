# Composite services manager
In this repository is included the **Composite services manager** enabler of the ASSIST-IoT Manageability enablers. The other two manageability enablers (Enablers manager and Clusters and topology manager) can be found in [this repository](https://github.com/assist-iot/managability_enablers).

## Repository structure
This repository is structured in 4 folders:

- **agents**: code and Helm charts of each agent (HTTP-MQTT and MQTT-HTTP).
- **core**: code of the core component of the enabler.
- **helm-chart**: Helm chart of the enabler itself (core and Node-RED, without the agents).
- **node-red**: custom Node-RED for the enabler, which is used as the frontend part of it. This folder also includes the custom Node-RED nodes.

## Documentation
An extended documentation of the enabler is available in the [official ASSIST-IoT documentation](https://assist-iot-enablers-documentation.readthedocs.io/en/latest/verticals/manageability/management_of_services_and_enablers.html), which is in *Read the Docs* format.
