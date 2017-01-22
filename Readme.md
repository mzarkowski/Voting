# Voting app

A simple client-server voting application with docker-compose and cloudformation setup. 

[See live demo](http://ec2-54-202-143-249.us-west-2.compute.amazonaws.com)

![Screenshot](demo/demo.png?raw=true "Demo")

## Getting started
### Locally
Run:
```sh
docker-compose up
```
(will clash with any other webserver running on host:80)

and open http://localhost in your browser.

### AWS

Go to *CloudFormation > Create Stack* and upload ec2_cloudFormation.json template. 

**Parameters** *(no need to change anything if you run the template in Oregon):*
 * InstanceType must be a valid EC2 instance type (default t2.nano)
 * InstanceAMI must be a valid Ubuntu 16.04 (default works only for Oregon)

**Outputs**
 * PublicDNS

Wait ~10 minutes for docker to launch and open *PublicDNS* in your browser. 

![Screenshot](demo/aws.png?raw=true "AWS output")

### Architecture:
- A nodejs backend for handling sockets and serving static website
- A mongodb database

### AWS:
- a security group with port 80 allowed for everyone
- an ec2 instance without keypair with public IP launched into default VPC
