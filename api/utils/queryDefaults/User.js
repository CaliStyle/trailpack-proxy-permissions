module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.orm['Role'],
          as: 'roles'
        },
        {
          model: app.orm['Passport'],
          as: 'passports'
        }
      ]
    }
  }
}
