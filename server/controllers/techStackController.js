const express = require('express');
const Skills = require("../models/Skills.js");

const getTechStacks = async (req, res) => {
    console.log("getTechStacks");
    try {
        const techStacks = await Skills.find();
        res.status(200).json(techStacks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {getTechStacks};