export default {
  protocol: 'https',
  host: 'localhost',
  port: 3000,
  apiProxyEndPoint: 'localhost:3000/proxy',
  sfClientId: '3MVG9uudbyLbNPZO5Nr_ezr0Aa9irvO2gdoBcihgVVhQk7U6RO9T9PR6LPm89vHaEctZrifYAHfyty2NPSLhC',
  sfLoginUrl: 'https://login.salesforce.com',
  sfSandboxUrl: 'https://test.salesforce.com',
  sfAuthRedirectUrl: 'https://localhost:3000/login',
  sslDir: '/Users/georgezhu/dev/ssl',
  app: {
    htmlAttributes: { lang: 'en' },
    title: 'Salesforce Toolkit',
    titleTemplate: 'Salesforce Toolkit - %s',
    meta: [
      { name: 'description', content: 'Salesforce Toolkit' }
    ]
  }
};
