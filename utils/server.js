const cachios = require('cachios');

async function getServerEndpoints() {
  return cachios.get('https://cdn.tycoon.community/servers.json', {
    ttl: 10 * 60
  }).then((resp) => {
    return resp.data;
  });
}

async function getServerStates(includePlayers = false) {
  let sEndpoints;
  try {
    sEndpoints = await getServerEndpoints();
  } catch (e) {
    return null;
  }

  const serverInfo = {
    states: [],
    totalPlayers: 0,
    serversAlive: 0
  };

  return new Promise((resolve) => {
    sEndpoints.servers.forEach((sInfo, idx) => {
      serverInfo.states[idx] = {
        name: sInfo.name,
        id: sInfo.id,
        number: sInfo.number,
        alive: false,
        extraData: {}
      };

      cachios.get(`https://${sInfo.owner}-${sInfo.id}.users.cfx.re/${sInfo.endpoint}`, {
        ttl: 1 * 60,
        timeout: 5000,
      }).then((sRes) => {
        if (sRes.status !== 200) {
          if (idx === sEndpoints.servers.length - 1) return resolve(serverInfo);
          return;
        }

        serverInfo.serversAlive++;
        serverInfo.states[idx].alive = true;
        serverInfo.totalPlayers += sRes.data.players.length;

        serverInfo.states[idx].extraData = {
          players: includePlayers ? sRes.data.players : null,
          dxp: sRes.data.server.dxp,
          uptime: sRes.data.server.uptime,
          playerCount: sRes.data.players.length,
          limit: sRes.data.server.limit
        };

        if (idx === sEndpoints.servers.length - 1) {
          return resolve(serverInfo);
        }

      }).catch(() => {
        if (idx === sEndpoints.servers.length - 1) {
          return resolve(serverInfo);
        }
      });
    });
  });
}

module.exports = {
  getServerEndpoints,
  getServerStates
};