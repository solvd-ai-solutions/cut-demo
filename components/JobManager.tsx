import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { dataStore } from '../services/dataStore';
import { CutJob } from '../types';
import { measurementUtils } from '../utils';


interface JobManagerProps {
  onBack: () => void;
}

export function JobManager({ onBack }: JobManagerProps) {
  const [jobs, setJobs] = useState<CutJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<CutJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<CutJob | null>(null);


  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.orderCode && job.orderCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, statusFilter]);

  const loadJobs = () => {
    const allJobs = dataStore.getJobs();
    // Sort by creation date, newest first
    allJobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    setJobs(allJobs);
  };

  const updateJobStatus = (jobId: string, status: CutJob['status']) => {
    dataStore.updateJobStatus(jobId, status);
    loadJobs();
    if (selectedJob && selectedJob.id === jobId) {
      const updatedJob = jobs.find(j => j.id === jobId);
      setSelectedJob(updatedJob || null);
    }
  };

  const getStatusBadge = (status: CutJob['status']) => {
    switch (status) {
      case 'pending':
        return (
          <div className="solv-badge-warning">
            Pending
          </div>
        );
      case 'completed':
        return (
          <div className="solv-badge-success">
            Completed
          </div>
        );
      case 'cancelled':
        return (
          <div className="solv-badge-danger">
            Cancelled
          </div>
        );
      default:
        return (
          <div className="solv-badge">
            {status}
          </div>
        );
    }
  };



  return (
    <div className="h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b-2 border-black p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="solv-button-secondary flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4 stroke-2 text-black" />
              Back
            </button>
            <div>
              <h1 className="solv-h1 text-black">Job Manager</h1>
              <p className="solv-body text-black opacity-70">Manage and track all cutting jobs</p>
            </div>
          </div>
          <Eye className="h-8 w-8 text-solv-lavender stroke-2" />
        </div>
      </div>

      {/* Main Content - Single Viewport Grid */}
      <div className="h-[calc(100%-120px)] p-6 overflow-hidden">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-2 h-full">
            <div className="solv-card h-full overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-solv-teal stroke-2" />
                <h2 className="solv-h2 text-black">All Jobs</h2>
              </div>
              
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black opacity-50" />
                  <input
                    type="text"
                    placeholder="Search by customer, material, or order code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="solv-input pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="solv-input w-40"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex-1 overflow-auto space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-16 w-16 text-black opacity-30 mx-auto mb-4" />
                    <p className="solv-body text-black opacity-50">
                      {jobs.length === 0 ? 'No jobs found' : 'No jobs match your search'}
                    </p>
                  </div>
                ) : (
                  filteredJobs.map(job => (
                    <div
                      key={job.id}
                      className={`border-2 border-black rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedJob?.id === job.id 
                          ? 'bg-solv-teal bg-opacity-10' 
                          : 'hover:bg-black hover:bg-opacity-5'
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="solv-body font-semibold text-black">{job.customerName}</h3>
                          <p className="solv-small text-black opacity-70">Job #{job.id}</p>
                          {job.orderCode && (
                            <p className="solv-small font-mono bg-white border border-black px-2 py-1 rounded mt-1 inline-block text-black">
                              {job.orderCode}
                            </p>
                          )}
                        </div>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-4 solv-small">
                        <div>
                          <p className="text-black opacity-50">Material</p>
                          <p className="font-semibold text-black">{job.material.name}</p>
                        </div>
                        <div>
                          <p className="text-black opacity-50">Specifications</p>
                          <p className="font-semibold text-black">{job.length}ft × {job.quantity} pieces</p>
                        </div>
                        <div>
                          <p className="text-black opacity-50">Cost</p>
                          <p className="font-semibold text-solv-teal">${job.totalCost.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-black opacity-50">Created</p>
                          <p className="font-semibold text-black">{job.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="h-full">
            <div className="solv-card h-full overflow-auto">
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle className="h-5 w-5 text-solv-coral stroke-2" />
                <h2 className="solv-h2 text-black">Job Details</h2>
              </div>
              
              {selectedJob ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="solv-h2 text-black">{selectedJob.customerName}</h3>
                    <p className="solv-small text-black opacity-70">Job #{selectedJob.id}</p>
                    {selectedJob.orderCode && (
                      <p className="solv-body font-mono bg-black text-white px-4 py-2 rounded-lg mt-2 tracking-widest">
                        {selectedJob.orderCode}
                      </p>
                    )}
                    <div className="mt-3">
                      {getStatusBadge(selectedJob.status)}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-black rounded-lg p-4 bg-white">
                      <h4 className="solv-body font-semibold text-black mb-3">Job Specifications</h4>
                      <div className="space-y-2 solv-small">
                        <div className="flex justify-between">
                          <span className="text-black opacity-70">Material:</span>
                          <span className="font-semibold text-black">{selectedJob.material.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black opacity-70">Length:</span>
                          <span className="font-semibold text-black">
                            {measurementUtils.formatMeasurement(selectedJob.length, selectedJob.measurementUnit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black opacity-70">Quantity:</span>
                          <span className="font-semibold text-black">{selectedJob.quantity} pieces</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black opacity-70">Total Length:</span>
                          <span className="font-semibold text-black">
                            {measurementUtils.formatMeasurement(selectedJob.length * selectedJob.quantity, selectedJob.measurementUnit)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-solv-teal bg-opacity-10 border-2 border-black rounded-lg p-4">
                      <h4 className="solv-body font-semibold text-black mb-3">Cost Breakdown</h4>
                      <div className="space-y-2 solv-small">
                        <div className="flex justify-between">
                          <span className="text-black">Total Cost:</span>
                          <span className="font-semibold text-black">${selectedJob.totalCost.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-solv-lavender bg-opacity-10 border-2 border-black rounded-lg p-4">
                      <h4 className="solv-body font-semibold text-black mb-3">Timeline</h4>
                      <div className="space-y-2 solv-small">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-black" />
                          <span className="text-black">
                            Created: {selectedJob.createdAt.toLocaleDateString()} at {selectedJob.createdAt.toLocaleTimeString()}
                          </span>
                        </div>
                        {selectedJob.completedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-black" />
                            <span className="text-black">
                              Completed: {selectedJob.completedAt.toLocaleDateString()} at {selectedJob.completedAt.toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedJob.notes && (
                      <div className="bg-solv-coral bg-opacity-10 border-2 border-black rounded-lg p-4">
                        <h4 className="solv-body font-semibold text-black mb-2">Special Instructions</h4>
                        <p className="solv-small text-black">{selectedJob.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">


                    {selectedJob.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateJobStatus(selectedJob.id, 'completed')}
                          className="solv-button-primary w-full flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Complete
                        </button>
                        <button
                          onClick={() => updateJobStatus(selectedJob.id, 'cancelled')}
                          className="w-full bg-solv-coral text-white border-none rounded-lg px-4 py-2 solv-body font-semibold cursor-pointer hover:bg-opacity-80 transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Job
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-black opacity-30 mx-auto mb-4" />
                  <p className="solv-body text-black opacity-50">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}