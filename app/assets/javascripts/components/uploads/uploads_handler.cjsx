React          = require 'react'
UploadList     = require './upload_list.cjsx'
AssignmentList = require '../assignments/assignment_list.cjsx'
UIActions      = require('../../actions/ui_actions.js').default
ServerActions  = require('../../actions/server_actions.js').default


UploadsHandler = React.createClass(
  displayName: 'UploadsHandler'
  sortSelect: (e) ->
    UIActions.sort 'uploads', e.target.value
  componentWillMount: ->
    ServerActions.fetch 'uploads', @props.course_id
  render: ->
    <div id='uploads'>
      <div className='section-header'>
        <h3>Files Uploaded to Wikimedia Commons</h3>
        <div className='sort-select'>
          <select className='sorts' name='sorts' onChange={@sortSelect}>
            <option value='file_name'>File Name</option>
            <option value='uploader'>Uploaded By</option>
            <option value='usage_count'>Usages</option>
          </select>
        </div>
      </div>
      <UploadList {...@props} />
    </div>
)

module.exports = UploadsHandler
