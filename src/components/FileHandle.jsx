import React, { useState } from "react";
import axios from "axios";

const FileHandle = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedJobDescriptionFile, setSelectedJobDescriptionFile] =
    useState(null);

  const [uploadStatus, setUploadStatus] = useState("");
  const [rankedCvs, setRankedCvs] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleJobDescriptionFileChange = (event) => {
    setSelectedJobDescriptionFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Append job description file
      if (selectedJobDescriptionFile) {
        formData.append("jobDescriptionFile", selectedJobDescriptionFile);
      }

      setUploadStatus("Uploading...");

      const response = await axios.post(
        "http://localhost:5000/process_cvs",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadStatus("Upload Complete");
      setRankedCvs(response.data.ranked_cvs);
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Upload Failed");
    }
  };

  return (
    <section class="bg-gray-900 min-h-screen flex flex-col justify-center items-center">
      <div class="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12 ">
        <h1 class="mb-4 text-4xl capitalize font-extrabold tracking-tight leading-none text-gray- md:text-5xl lg:text-6xl text-white">
          Rank CVs to get the best candidate!
        </h1>
        <p class="mb-8 text-lg font-normal  lg:text-xl sm:px-16 xl:px-48 text-gray-400">
          With the help of NER and Sentence Transformation, rank match between
          thousands of CVs and get the best one's shortlisted 🚀
        </p>
        <div class="">
          {/* Upload CVs */}
          <div className="flex flex-col mb-6 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <label
              htmlFor="fileInput"
              className="text-gray-300 cursor-pointer inline-flex justify-center items-center p-6 text-base font-medium text-center rounded-lg bg-gray-700 hover:bg-gray-800 focus:ring-4 ring-gray-900 transition duration-300"
            >
              Upload CVs
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                className="text-gray-500 cursor-pointer inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-900 transition duration-300"
              />
            </label>
            {selectedFiles.length > 0 && (
              <p className="text-gray-400 ml-2">
                {selectedFiles.length} file(s) uploaded
              </p>
            )}
          </div>

          {/* Upload Job Description */}
          <div className="flex flex-col mb-6 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <label
              htmlFor="jobDescriptionInput"
              className="text-gray-300 cursor-pointer inline-flex justify-center items-center p-6 text-base font-medium text-center rounded-lg bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-900 transition duration-300"
            >
              Upload Job Description
              <input
                type="file"
                id="jobDescriptionInput"
                style={{ display: "none" }}
                onChange={handleJobDescriptionFileChange}
                className="text-gray-500 cursor-pointer inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center rounded-lg bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-900 transition duration-300"
              />
            </label>
            {selectedJobDescriptionFile && (
              <p className="text-gray-400 ml-2">
                1 job description file uploaded
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            className="inline-flex my-6 justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4  focus:ring-blue-900 transition duration-300"
          >
            Upload
          </button>
          {uploadStatus && <p className="text-white">{uploadStatus}</p>}
        </div>
      </div>
      <div class="my-8 px-4 mx-auto max-w-7xl">
        <table class="w-full border-collapse border border-gray-700">
          <thead class="bg-gray-100 dark:bg-gray-800 text-white">
            <tr>
              <th class="border border-gray-700 py-4 px-16 text-center">
                File Name
              </th>
              <th class="border border-gray-700 py-4 px-16 text-center">
                Rank
              </th>

              <th class="border border-gray-700 py-4 px-16 text-center">
                Score
              </th>
              <th class="border border-gray-700 py-4 px-16 text-center">
                NER Output
              </th>
            </tr>
          </thead>
          <tbody>
            {rankedCvs.map((cv, index) => (
              <tr key={index} className="text-white">
                <td class="border border-gray-700 py-2 px-4">{cv.file_name}</td>
                <td class="border border-gray-700 py-4 px-16 text-center">
                  {cv.rank}
                </td>

                <td class="border border-gray-700 py-4 px-16 text-center">
                  {cv.score.toFixed(2)}%
                </td>
                <td class="border border-gray-700 py-4 px-16">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    class="text-blue-400 py-3 underline cursor-pointer"
                  >
                    {showDropdown ? "Hide NER Output" : ">"}
                  </button>
                  {showDropdown && (
                    <ul class="list-disc list-inside">
                      {cv.ner_output.map((item, itemIndex) => (
                        <li key={itemIndex}>{`${item[0]}`}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default FileHandle;
