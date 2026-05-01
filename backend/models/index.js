// models/index.js — set up all associations here
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');

// A Project is created by a User
Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
User.hasMany(Project, { foreignKey: 'createdBy' });

// A Task belongs to a Project and is assigned to a User
Task.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Task, { foreignKey: 'projectId' });

Task.belongsTo(User, { as: 'assignee', foreignKey: 'assignedTo' });
User.hasMany(Task, { foreignKey: 'assignedTo' });

// Many-to-many: Project has many members (Users)
const ProjectMember = require('./ProjectMember');
Project.belongsToMany(User, { through: ProjectMember, as: 'members', foreignKey: 'projectId' });
User.belongsToMany(Project, { through: ProjectMember, as: 'projects', foreignKey: 'userId' });

module.exports = { User, Project, Task, ProjectMember };
