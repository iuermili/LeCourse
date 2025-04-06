export {make_request, init_student_endpoint_path, fetch_classes_endpoint_path};

// use these two to make a request after the user has input the
// classes they have taken AND selected their major from the dropdown.
// (optional maybe?) can remake this request if the user is not satisfied
// with the response data 
init_student_ex_data = { 
  // replace these values with the variables you are using to store this info
  major: 'Computer Science',
  courses_taken: 'CS101, math201, luffy303, CS'
};
init_student_endpoint_path = '/init_student';
// the response data for this will be in the form of a StudentInfoResponse
// see /backend/postModels.py for its format

// use these two to make a request whenever a class is checked/unchecked 
// from the selected courses, course list,  OR when the student interests 
// input box if updated
fetch_classes_ex_data = {
  // replace these values with the variables you are using to store this info
  criteria: ['Natural Science, Arts & Humanities'],
  interested_topics: 'i like drawing please help me out LeCourse'
};
fetch_classes_endpoint_path = '/fetch_classes';
// the response data for this will be in the form of a CourseFilterResponse
// see /backend/postModels.py for its format

async function make_request(request_data, endpoint_path) {
  const api_url = 'http://localhost:8000' + endpoint_path
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(request_data)
    });

    // (not sure how valid this error handling is) check for HTTP errors first
    if (!response.ok) {
       let errorMsg = `HTTP error ${response.status}: ${response.statusText}`;
       try {
           // try to get more specific error detail from FastAPI response
           const errorData = await response.json();
           errorMsg = `HTTP error ${response.status}: ${errorData.detail || JSON.stringify(errorData)}`;
       } catch (parseError) {
           // ignore if response body wasn't valid JSON
       }
       throw new Error(errorMsg);
    }
    // parse the successful JSON response
    const data = await response.json(); 
    console.log('Success:', data);
    return data;

  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}