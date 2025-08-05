const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

const config = {
  serverPort: process.env.PORT || 5500,
  env: process.env.NODE_ENV || 'development',
  pseudonymizerUrl: process.env.PSEUDONYMIZER_URL || null,
  keyScopeManager: process.env.KEY_SCOPE_MANAGER || null,
  keyGithub: process.env.KEY_GITHUB || null,
  keyPivotal: process.env.KEY_PIVOTAL || null,
  keyHeroku: process.env.KEY_HEROKU || null,
  keyTravisPublic: process.env.KEY_TRAVIS_PUBLIC || null,
  keyTravisPrivate: process.env.KEY_TRAVIS_PRIVATE || null,
  keyCodeclimate: process.env.KEY_CODECLIMATE || null,
  keyPseudonymizer: process.env.KEY_PSEUDONYMIZER || null,
  keyGitlab: process.env.KEY_GITLAB || null,
  keyRedmine: process.env.KEY_REDMINE || null,
  keyJira: process.env.KEY_JIRA || null,
};

module.exports = config;
