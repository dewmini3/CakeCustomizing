const optionRoutes = require('./routes/options');
const customizeRoutes = require('./routes/customize');

app.use('/api/option', optionRoutes);
app.use('/api/customize', customizeRoutes); 