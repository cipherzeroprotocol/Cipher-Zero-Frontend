const { exec } = require('child_process');
const path = require('path');

// Paths to your scripts
const deployContractsScript = path.resolve(__dirname, 'migrations/2_deploy_contracts.js');
const thetaIntegrationScript = path.resolve(__dirname, 'theta-integration/thetaIntegration.js');
const bitTorrentIntegrationScript = path.resolve(__dirname, 'backend/ThetaTorrent/thetaTorrentIntegration.js');

// Deploy smart contracts
exec(`truffle migrate --reset`, (err, stdout, stderr) => {
  if (err) {
    console.error('Error deploying contracts:', err);
    return;
  }
  console.log('Contracts deployed:', stdout);

  // Integrate Theta Network
  exec(`node ${thetaIntegrationScript}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error integrating Theta:', err);
      return;
    }
    console.log('Theta integration successful:', stdout);

    // Integrate BitTorrent-like structures
    exec(`node ${bitTorrentIntegrationScript}`, (err, stdout, stderr) => {
      if (err) {
        console.error('Error integrating BitTorrent:', err);
        return;
      }
      console.log('BitTorrent integration successful:', stdout);
    });
  });
});
