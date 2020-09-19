const functions = require('firebase-functions')
const firebase = require('firebase-admin')
const express = require('express')
const engines = require('consolidate')
const { getStudents, getStudentByName } = require('./src/students')

const app = express()

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
)

function getCourses() {
  const ref = firebase.database().ref('courses')
  return ref.once('value').then(snap => snap.val())
}

app.engine('hbs', engines.handlebars)
app.set('views', './views')
app.set('view engine', 'hbs')

app.get('/courses', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-max-age=600')
  getCourses().then(courses => {
    res.render('index', { courses })
  })
})
app.get('/courses.json', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300, s-max-age=600')
  getCourses().then(courses => {
    res.json(courses)
  })
})

app.get('/students', getStudents)
app.get('/students/:name', getStudentByName)

exports.app = functions.https.onRequest(app)
