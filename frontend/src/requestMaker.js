// Define the variables first
export const init_student_endpoint_path = '/init_student';
export const fetch_classes_endpoint_path = '/fetch_classes';

// Example data (you can keep these or remove them)
export const init_student_ex_data = {
  major: 'Computer Science',
  courses_taken: 'CS101, math201, luffy303, CS',
};

export const fetch_classes_ex_data = {
  criteria: ['Natural Science, Arts & Humanities'],
  interested_topics: 'i like drawing please help me out LeCourse',
};

// Your make_request function
export async function make_request(request_data, endpoint_path) {
  const api_url = 'http://localhost:8000' + endpoint_path;
  try {
    const response = await fetch(api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(request_data),
    });

    if (!response.ok) {
      let errorMsg = `HTTP error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMsg = `HTTP error ${response.status}: ${errorData.detail || JSON.stringify(errorData)}`;
      } catch (parseError) {
        // ignore if response body wasn't valid JSON
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log('Success:', data);
    return data;
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
}