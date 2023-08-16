'use strict';
const Issue = require('../models')

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(async function (req, res){
      // to get all issues with the project name
      let project = req.params.project;
      const {issue_title, issue_text, created_by, assigned_to, open, status_text, _id} = req.query

      const valid = returnDefined(issue_title, issue_text, created_by, assigned_to, open, status_text, _id)
      let issues 
      
       if (issue_title || issue_text || created_by || assigned_to || open || status_text || _id) {
        issues = await Issue.find({project_name: project, ...valid})
      }  else {
         issues = await Issue.find({project_name: project}) 
      }
   
      // let issuesToSend = issues.map(i => {
      //   return {
      //     _id: i._id,
      //     issue_text: i.issue_text,
      //     issue_title: i.issue_title,
      //     created_on: i.created_on,
      //     updated_on: i.updated_on,
      //     created_by: i.created_by,
      //     assigned_to: i.assigned_to,
      //     open: i.open,
      //     status_text: i.status_text
      //   }
      // })
      // res.send(issuesToSend)
      res.send(issues)
    })
    
    .post(async function (req, res){
      // to post an issue with necessary information
      let project = req.params.project;
      
      const {issue_text, created_by, issue_title, assigned_to = '', status_text = '', open = true} = req.body

      if (issue_text && created_by && issue_title) {
          const issueToSave = new Issue({
        issue_text, created_by, issue_title, assigned_to , status_text, open, project_name: project
      })
      let issue = await issueToSave.save()

      const issueToSend = {issue_title: issue.issue_title, 
              issue_text: issue.issue_text,
               created_by: issue.created_by,
               created_on: issue.created_on,
               assigned_to: issue.assigned_to,
               open: issue.open,
               status_text: issue.status_text,
               updated_on: issue.updated_on,
                _id: issue._id.toString()
               }
        // console.log("post", issueToSend)
      res.json(issueToSend)
        
      } else {
        res.json({error: 'required field(s) missing'})
      }
    })
    
    .put(async function (req, res){
      // to update an issue with id and other information
      let project = req.params.project;
      const {_id, issue_title, issue_text, created_by, assigned_to, status_text, open} = req.body

      // if no id
      if (!_id) {
        res.send({ error: 'missing _id' })
        return
      }

      // if no required fields
      const fields = returnDefined(issue_title, issue_text, created_by, assigned_to, open, status_text)
      if (Object.keys(fields).length === 0) {
        res.send({ error: 'no update field(s) sent', '_id': _id })
        return
      }

      // if no issue
      const issue = await Issue.findOne({_id})
      console.log('issue before update',issue)
      if (!issue) {
        res.send({ error: 'could not update', '_id': _id })
        return
      }

      console.log('fields to update', fields)
      Object.keys(fields).map(field => {
        issue[field] = fields[field]
      })
      
      issue.updated_on = new Date()
      const issueAfterUpdate = await issue.save()
      console.log('issue after update',issueAfterUpdate)
      
      res.send({  result: 'successfully updated', '_id': _id })
    })
    
    .delete(async function (req, res){
      // delete route to delete a particular issue with id
      let project = req.params.project;
      const {_id} = req.body
      if (!_id) {
        res.send({ error: 'missing _id' })
        return
      }
      
      const issue = await Issue.findOne({_id})
      if (!issue) {
        res.send({ error: 'could not delete', '_id': _id })
        return
      }

      const result = await Issue.deleteOne({_id})
      console.log(issue, result)
      res.send({ result: 'successfully deleted', '_id': _id })
      return
    }
  )
}

const returnDefined = (issue_title, issue_text, created_by, assigned_to, open, status_text, _id) => {
  let defined = {}
  if (issue_title) {
    defined['issue_title'] = issue_title
  }
  if (issue_text) {
    defined['issue_text'] = issue_text
  }
   if (open === true || open === false) {
    defined['open'] = open
  }
   if (created_by) {
    defined['created_by'] = created_by
  }
   if (assigned_to) {
    defined['assigned_to'] = assigned_to
  }
   if (status_text) {
    defined['status_text'] = status_text
  }
  if (_id) {
    defined['_id'] = _id
  }
  return defined
}
