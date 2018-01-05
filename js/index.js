$(document).ready(function () {
  $.ajax({
    url: "http://localhost:9000/get-tasks",
    success: function (response) {

      var res = JSON.parse(response);

      console.log('response ', res);

      if (res.success) {
        res.rows.forEach(row => {
          console.log('row ', row);

          $('#tasks_ul').append(`
            <li id=${row.id} class=${row.complete ? 'complete' : ''} data-complete="${row.complete}" data-id="${row.id}">${row.task}</li>
          `);
        });
      }
      return events();
    }
  });



  function addTask() {
    var text = $('#task_input').val();

    if (text.trim()) {
      console.log('pressed enter');
      $.ajax({
        url: "http://localhost:9000/add-task",
        method: 'POST',
        data: {
          task: text
        },
        success: function (response) {
          var res = JSON.parse(response);

          console.log('response ', res);

          if (res.success) {

            $('#tasks_ul').append(`
              <li id=${res.id} data-complete="false" data-id="${res.id}">${res.task}</li>
            `);

            $('#task_input').val('');

          }
        }
      });
    }
  }

  // clear button
  const clearBtn = document.getElementById("clearBtn");

  // clearTasks function
  clearBtn.addEventListener('click', function () {
    $.ajax({
      url: "http://localhost:9000/clearTaskList",
      method: 'GET',
      success: function (response) {
        console.log(response)
        response = JSON.parse(response);
        if (response.success) {
          $('#tasks_ul').remove();
        }
      }
    })
  })


  function events() {
    $('li').click(function () {
      var complete = $(this).data('complete');
      var id = $(this).data('id');

      console.log('li id ', id);
      console.log('li status ', complete);

      $.ajax({
        url: "http://localhost:9000/change-status",
        method: 'POST',
        data: {
          complete: !complete,
          id: id
        },
        success: function (response) {
          var res = JSON.parse(response);

          if (res.success) {
            console.log('response ', res);
            var lid = '#' + id;
            $(lid).toggleClass('complete');
          }
        }
      });

    });
  }

  $('#task_input').keypress(function (e) {
    if (e.which === 13) {
      addTask();
    }
  })

  $('#addBtn').click(function (e) {
    addTask()
  });

  // $('#clearBtn').click(function (e) {
  //   clearTaskList()
  // });

});