$(function(){

  // $('#submit').on('click', function(event){
  //   let title  = $('#title').val();
  //   makeCall(name);
  // });

  // function makeCall(title){
  //   var url = `https://gateway.marvel.com:443/v1/public/comics?dateDescriptor=thisMonth&titleStartsWith=${title}&limit=20&ts=1507140969558&apikey=46278f901526c87460b842a56dfde620&hash=48e0227480eccb8cd5c928b757883160`;
  //   $.ajax(url, {
  //     success: function(data){
  //       console.log('Data:', data);
  //       getData(data)
  //     }
  //   })

  // };

  // function getData(responseData){

  //     let title = responseData.results.name;
  //     let description = responseData.results.description;
  //     let thumbnail= responseData.results.thumbnail.path;
  //     let price = responseData.results.prices.price;
    
  //   appendToDom(title, description, thumbnail);
  // };

  // function appendToDom(name, description, thumbnail, price){
  //   let $result = $('#result').empty();
  //   let $name = $('<div class="city"></div>').text(`City: ${city}`).appendTo($result);
  //   let $description = $('<div class="description"></div>').text(`Description: ${description}`).appendTo($result);
  //   let $thumbnail = $('<div class="thumbnail"></div>').url(`thumbnail: ${thumbnail}`).appendTo($result);
  //   let price = $('<<div class="price"></div>').text(`price: ${price}`).appendTo($result);

  // };

const deleteBook = (id) => {
        $.ajax({
            url: `/books/${id}`,
            type: 'DELETE',
            success: () => {
                window.location.reload();
            },
            error: (err) => {
                console.log(err);
            }
        });
    };

    $(document).on('click', '.delete-book', e => {
        const id = $(e.target).attr('data-id');
        deleteBook(id);
    });


  //   $('form').on('submit', e => {
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