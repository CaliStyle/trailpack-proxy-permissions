module.exports = {
  default: (app) => {
    return {
      include: [
        {
          model: app.orm['Role'],
          as: 'roles'
        }
      ]
    }
  }
}
