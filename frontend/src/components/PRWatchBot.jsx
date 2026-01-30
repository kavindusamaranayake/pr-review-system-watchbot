import { useState } from "react";
import { Plus, X, Send, Check } from "lucide-react";

const PRWatchBot = () => {
  const [formData, setFormData] = useState({
    bootcamp: "",
    userName: "",
    cohort: "",
    codeowners: [],
    collaborators: [],
  });

  const [newCodeowner, setNewCodeowner] = useState("");
  const [newCollaborator, setNewCollaborator] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState({});

  // Bootcamp options
  const bootcampOptions = ["fullstack", "solidity", "seca"];

  // Predefined users for codeowners with real names
  const predefinedUsers = [
    { username: "dhruvinparikh", realName: "Dhruvin Parikh" },
    { username: "dkillen", realName: "David Killen" },
    { username: "Timothy-Liu", realName: "Timothy Liu" },
    { username: "G-Kavinesh", realName: "Kavinesh" },
    { username: "nigeljacob", realName: "Nigel Jacob" },
    { username: "AaronJE45", realName: "Aaron" },
    { username: "Prabhashan19", realName: "Prabashan" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.bootcamp.trim()) {
      newErrors.bootcamp = "Bootcamp selection is required";
    }

    if (!formData.userName.trim()) {
      newErrors.userName = "User name is required";
    }

    if (!formData.cohort.trim()) {
      newErrors.cohort = "Cohort is required";
    }

    if (formData.codeowners.length === 0) {
      newErrors.codeowners = "At least one codeowner is required";
    }

    if (formData.collaborators.length === 0) {
      newErrors.collaborators = "At least one collaborator is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      repo: `${formData.bootcamp}-${formData.cohort}-${formData.userName}`,
      codeowners: formData.codeowners.map((user) => user.username),
      collaborators: formData.collaborators,
      enableWorkflow: true, // Always install PR monitoring workflow
    };

    try {
      const response = await fetch(
        "https://watch-bot-repo-creator.automations-3d6.workers.dev",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      console.log("Payload to submit:", payload);

      if (response.ok) {
        setSubmitStatus("success");
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            bootcamp: "",
            userName: "",
            cohort: "",
            codeowners: [],
            collaborators: [],
          });
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addCodeowner = (username, isFromDropdown = false) => {
    const userObj = predefinedUsers.find((user) => user.username === username);
    const newCodeowner = userObj
      ? { username: userObj.username, realName: userObj.realName }
      : { username: username, realName: username };

    if (
      username &&
      !formData.codeowners.some((user) => user.username === username)
    ) {
      setFormData((prev) => ({
        ...prev,
        codeowners: [...prev.codeowners, newCodeowner],
      }));
      if (!isFromDropdown) {
        setNewCodeowner("");
      }
    }
  };

  const removeCodeowner = (username) => {
    setFormData((prev) => ({
      ...prev,
      codeowners: prev.codeowners.filter((user) => user.username !== username),
    }));
  };

  const addCollaborator = () => {
    if (newCollaborator && !formData.collaborators.includes(newCollaborator)) {
      setFormData((prev) => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator],
      }));
      setNewCollaborator("");
    }
  };

  const removeCollaborator = (username) => {
    setFormData((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((user) => user !== username),
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-white/10 p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
            GitHub Repository Setup
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Create and configure student repositories with codeowners and
            collaborators
          </p>

          <div className="space-y-6">
            {/* Repository Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                Repository Details
              </h2>

              {/* Bootcamp Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Bootcamp *
                </label>
                <select
                  value={formData.bootcamp}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      bootcamp: e.target.value,
                    }))
                  }
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.bootcamp
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 focus:ring-[#ccf621]/30"
                  }`}
                >
                  <option value="">Select a bootcamp</option>
                  {bootcampOptions.map((bootcamp) => (
                    <option key={bootcamp} value={bootcamp}>
                      {bootcamp}
                    </option>
                  ))}
                </select>
                {errors.bootcamp && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.bootcamp}
                  </p>
                )}
              </div>

              {/* Cohort Selection */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Cohort *
                </label>
                <input
                  type="text"
                  value={formData.cohort}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      cohort: e.target.value,
                    }))
                  }
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.cohort
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 focus:ring-[#ccf621]/30"
                  }`}
                  placeholder="Enter cohort (e.g., c01, c02)"
                />
                {errors.cohort && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.cohort}
                  </p>
                )}
              </div>

              {/* User Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                  }
                  className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.userName
                      ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-800"
                      : "border-gray-300 dark:border-gray-600 focus:ring-[#ccf621]/30"
                  }`}
                  placeholder="Enter student username"
                />
                {errors.userName && (
                  <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                    {errors.userName}
                  </p>
                )}

                {/* Preview */}
                {formData.bootcamp && formData.cohort && formData.userName && (
                  <div className="mt-2 p-3 bg-[#ccf621]/10 dark:bg-[#ccf621]/5 rounded-lg border-l-4 border-[#ccf621]">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Repository will be:{" "}
                      <strong className="text-gray-900 dark:text-white font-mono">
                        {formData.bootcamp}-{formData.cohort}-
                        {formData.userName}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Codeowners Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                Code Owners *
              </h2>

              {/* Predefined Users Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Select from existing users
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addCodeowner(e.target.value, true);
                      e.target.value = "";
                    }
                  }}
                  className="w-full p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ccf621]/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Choose a user to add</option>
                  {predefinedUsers
                    .filter(
                      (user) =>
                        !formData.codeowners.some(
                          (codeowner) => codeowner.username === user.username,
                        ),
                    )
                    .map((user) => (
                      <option key={user.username} value={user.username}>
                        {user.realName} ({user.username})
                      </option>
                    ))}
                </select>
              </div>

              {/* Manual Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Or add manually
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCodeowner}
                    onChange={(e) => setNewCodeowner(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ccf621]/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter username"
                    onKeyDown={(e) =>
                      e.key === "Enter" && addCodeowner(newCodeowner)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => addCodeowner(newCodeowner)}
                    className="px-4 py-3 bg-[#ccf621] hover:bg-[#b8dd00] text-gray-900 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Selected Codeowners */}
              <div className="flex flex-wrap gap-2">
                {formData.codeowners.map((user) => (
                  <span
                    key={user.username}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-[#ccf621] text-gray-900 font-medium"
                  >
                    {user.realName}
                    <button
                      type="button"
                      onClick={() => removeCodeowner(user.username)}
                      className="hover:bg-black/10 rounded-full p-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              {errors.codeowners && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {errors.codeowners}
                </p>
              )}
            </div>

            {/* Collaborators Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/10 pb-2">
                Collaborators *
              </h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Add collaborators
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ccf621]/30 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter username"
                    onKeyDown={(e) => e.key === "Enter" && addCollaborator()}
                  />
                  <button
                    type="button"
                    onClick={addCollaborator}
                    className="px-4 py-3 bg-[#ccf621] hover:bg-[#b8dd00] text-gray-900 rounded-lg transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              {/* Selected Collaborators */}
              <div className="flex flex-wrap gap-2">
                {formData.collaborators.map((user) => (
                  <span
                    key={user}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-blue-500 dark:bg-blue-600 text-white font-medium"
                  >
                    {user}
                    <button
                      type="button"
                      onClick={() => removeCollaborator(user)}
                      className="hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              {errors.collaborators && (
                <p className="text-red-500 dark:text-red-400 text-sm">
                  {errors.collaborators}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={() => {
                  if (validateForm()) {
                    setShowSummary(true);
                  }
                }}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white"
                    : submitStatus === "success"
                      ? "bg-green-600 dark:bg-green-700 text-white"
                      : "bg-[#ccf621] hover:bg-[#b8dd00] text-gray-900"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <Check size={20} />
                    Success!
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Create Repository
                  </>
                )}
              </button>

              {submitStatus === "error" && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400 text-center">
                    Failed to submit. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-gray-200 dark:border-white/10 mx-4">
            <h3 className="text-xl font-bold text-center text-gray-900 dark:text-white">
              Review Your Submission
            </h3>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Repository:
                </p>
                <p className="font-mono font-semibold text-gray-900 dark:text-white">
                  {formData.bootcamp}-{formData.cohort}-{formData.userName}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Bootcamp:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.bootcamp}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">Cohort:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.cohort}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Student:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.userName}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Codeowners:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.codeowners.map((user) => user.realName).join(", ")}
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Collaborators:
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formData.collaborators.join(", ")}
                </p>
              </div>
            </div>

            {/* <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-400">
                ℹ️ PR monitoring workflow will be automatically installed
              </p>
            </div> */}

            <div className="flex justify-end gap-3 pt-4">
              <button
                className="px-5 py-2 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                onClick={() => setShowSummary(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-lg font-medium bg-[#ccf621] hover:bg-[#b8dd00] text-gray-900 transition-colors"
                onClick={() => {
                  setShowSummary(false);
                  handleSubmit();
                }}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PRWatchBot;
