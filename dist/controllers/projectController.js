"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Project = require('../models/Project'); // Asegúrate de que tienes un modelo de proyecto
exports.getAllProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Project.find();
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = new Project({
        name: req.body.name,
        description: req.body.description
    });
    try {
        const newProject = yield project.save();
        res.status(201).json(newProject);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        if (req.body.name != null) {
            project.name = req.body.name;
        }
        if (req.body.description != null) {
            project.description = req.body.description;
        }
        const updatedProject = yield project.save();
        res.json(updatedProject);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const project = yield Project.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: 'Project not found' });
        yield project.remove();
        res.json({ message: 'Project deleted' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
