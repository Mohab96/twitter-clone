const { redisClient } = require("./config/redis");

class ServiceDiscovery {
  constructor() {
    // Map of servicePath to serviceName
    this.services = {};

    for (let i = 0; i < Object.keys(process.env).length; i++) {
      const env_var_name = Object.keys(process.env)[i];
      const env_var_val = process.env[env_var_name];

      if (env_var_name.startsWith("service_")) {
        const serviceName = env_var_name.split("_")[1];
        const servicePath = env_var_val;
        this.services[servicePath] = serviceName;
        if (this.getRunningServicesCount(servicePath) === 0)
          this.scaleUp(serviceName); // Create at least one instance of the service
      }
    }

    this.startHealthChecks();
  }

  async getInstance(servicePath) {
    const runningInstances = await this.getInstances(servicePath);
    const instance =
      runningInstances[Math.floor(Math.random() * runningInstances.length)];

    return instance;
  }

  async getInstances(servicePath) {
    const serviceName = this.services[servicePath];
    const instances = await redisClient.keys(`service_${serviceName}_*`);

    if (instances.length === 0) {
      throw new Error(`No instances available for service: ${serviceName}`);
    }

    return instances;
  }

  async getRunningServicesCount(servicePath) {
    const serviceName = this.services[servicePath];
    const instances = await redisClient.keys(`service_${serviceName}_*`);

    return instances.length;
  }

  async getRunningServices() {
    const instances = await redisClient.keys(`service_*`);

    return instances;
  }

  async scaleUp(servicePath) {
    const alreadyRunning = await this.getInstances(servicePath);

    alreadyRunning.sort();

    let lastServiceIdx =
      alreadyRunning.length == 0
        ? 1
        : +alreadyRunning[alreadyRunning.length - 1].split("_")[2];

    if (lastServiceIdx < 10) lastServiceIdx = "0" + lastServiceIdx;

    const newInstanceId = `service_${serviceName}_${lastServiceIdx + 1}`;

    this.createInstance(newInstanceId);
  }

  async scaleDown(servicePath) {
    // TODO: choosing the instance to kill based on some criteria like least load

    const serviceName = this.services[servicePath];
    const alreadyRunningCnt = await this.getRunningServicesCount(serviceName);

    if (alreadyRunningCnt === 1) {
      throw new Error("Cannot scale down below 1 instance");
    }

    const instanceId = `service_${serviceName}_${alreadyRunningCnt}`;
    this.killInstance(instanceId);
  }

  // TODO: Implement these methods
  killInstance(serviceId) {}
  createInstance(serviceId) {}

  async startHealthChecks() {
    setInterval(async () => {
      const instances = await redisClient.keys(`service_*`);
      instances.forEach((instance) => {
        this.checkHealth(instance);
      });
    }, 5000);
  }

  async checkHealth(instance) {
    try {
      const instanceUrl = await redisClient.get(instance);

      const response = await fetch(`http://${instanceUrl}/health`);
      return response.status === 200;
    } catch (error) {
      this.killInstance(instance);
      this.scaleUp(instance);
    }
  }
}

const sd = new ServiceDiscovery();
module.exports = sd;
