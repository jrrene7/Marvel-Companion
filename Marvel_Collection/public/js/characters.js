$(function(){

  // $('#submit').on('click', function(event){
  // 	const name  = $('#name').val();
  // 	makeCall(name);
  // });

  // function makeCall(name){
  // 	var url = `https://gateway.marvel.com:443/v1/public/characters?name=${name}&ts=1507140969558&apikey=46278f901526c87460b842a56dfde620&hash=48e0227480eccb8cd5c928b757883160`;
  // 	$.ajax(url, {
  // 		success: function(data){
  // 			console.log('Data:', data);
  // 			getData(data)
  // 		}
  // 	})

  // };

  // function getData(responseData){

  // 		let name = responseData.results.name;
  // 		let description = responseData.results.description;
  // 		let thumbnail= responseData.results.thumbnail.path;
  	
  // 	appendToDom(name, description, thumbnail);
  // };

  // function appendToDom(name, description, thumbnail){
  // 	let $result = $('#result').empty();
  // 	let $name = $('<div class="city"></div>').text(`City: ${city}`).appendTo($result);
  // 	let $description = $('<div class="description"></div>').text(`Description: ${description}`).appendTo($result);
  // 	let $thumbnail = $('<div class="thumbnail"></div>').url(`thumbnail: ${thumbnail}`).appendTo($result);
  // };
const deleteCharacter = (id) => {
        $.ajax({
            url: `/characters/${id}`,
            type: 'DELETE',
            success: () => {
                window.location.reload();
            },
            error: (err) => {
                console.log(err);
            }
        });
    };

    $(document).on('click', '.delete-character', e => {
        const id = $(e.target).attr('data-id');
        deleteCharacter(id);
    });




// const editCharacter = (id) => {
//   const name = $('')
//   const name = $('#character-name').val();
//   const description = $('#character-description').val();
//   const thumbnail = $('#character-thumbnail').val();
//   $.ajax({
//     url: `/characters/home/edit/${id}`,
//     type: 'PUT',
//     data: {
//       name: name,
//       description: description,
//       thumbnail: thumbnail
//     },
//     success: (data) => {
//          window.location.reload();
//         $(`#characters-list[data-id]=${id}`);
//      },
//                 error: (err) => {
//                 console.log(err);
//             }
//       })
//   }

//   console.log("script is linked")
//     $('form').on('submit', e => {
//         const id = $(e.target).attr('data-id');
//         console.log(id);
//         editCharacter(id);
//     });


  //  $('form').on('submit', e => {
  //   e.preventDefault();
  //   // const id = $(e.target).attr('data-id');
  //   const formAction = $(this).attr('action');
  //   $.ajax({
  //     url: formAction,
  //     method: 'DELETE',
  //     success: data => {
  //       location.href = '/home'
  //     },
  //     error: err => console.log(err)
  //   })
  // })


}); // ends doc.ready