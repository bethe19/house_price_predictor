import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [formData, setFormData] = useState({
    area: '',
    bedrooms: '',
    bathrooms: '',
    stories: '',
    mainroad: 'yes',
    guestroom: 'no',
    basement: 'no',
    hotwaterheating: 'no',
    airconditioning: 'no',
    parking: '',
    prefarea: 'no',
    furnishingstatus: 'furnished'
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = {
      area: parseFloat(formData.area),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      stories: parseInt(formData.stories),
      mainroad: formData.mainroad,
      guestroom: formData.guestroom,
      basement: formData.basement,
      hotwaterheating: formData.hotwaterheating,
      airconditioning: formData.airconditioning,
      parking: parseInt(formData.parking),
      prefarea: formData.prefarea,
      furnishingstatus: formData.furnishingstatus
    }

    if (!data.area || !data.bedrooms || !data.bathrooms || !data.stories || data.parking === '') {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await axios.post(`${API_URL}/predict`, data)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while predicting price')
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResult(null)
    setError(null)
    setFormData({
      area: '',
      bedrooms: '',
      bathrooms: '',
      stories: '',
      mainroad: 'yes',
      guestroom: 'no',
      basement: 'no',
      hotwaterheating: 'no',
      airconditioning: 'no',
      parking: '',
      prefarea: 'no',
      furnishingstatus: 'furnished'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-white font-grotesk">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12 border-b-2 border-black pb-8">
          <h1 className="text-5xl font-bold text-black mb-4 tracking-tight">
            HOUSE PRICE PREDICTOR
          </h1>
          <p className="text-lg text-black font-medium">
            Predict house prices using Neural Network Regression
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border-2 border-black p-8">
            <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight border-b-2 border-black pb-4">
              House Features
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="area" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bedrooms" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="stories" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Stories
                  </label>
                  <input
                    type="number"
                    id="stories"
                    name="stories"
                    value={formData.stories}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="parking" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Parking
                  </label>
                  <input
                    type="number"
                    id="parking"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="mainroad" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Main Road
                  </label>
                  <select
                    id="mainroad"
                    name="mainroad"
                    value={formData.mainroad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="guestroom" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Guest Room
                  </label>
                  <select
                    id="guestroom"
                    name="guestroom"
                    value={formData.guestroom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="basement" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Basement
                  </label>
                  <select
                    id="basement"
                    name="basement"
                    value={formData.basement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hotwaterheating" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Hot Water Heating
                  </label>
                  <select
                    id="hotwaterheating"
                    name="hotwaterheating"
                    value={formData.hotwaterheating}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="airconditioning" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Air Conditioning
                  </label>
                  <select
                    id="airconditioning"
                    name="airconditioning"
                    value={formData.airconditioning}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="prefarea" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Preferred Area
                  </label>
                  <select
                    id="prefarea"
                    name="prefarea"
                    value={formData.prefarea}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="furnishingstatus" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                    Furnishing Status
                  </label>
                  <select
                    id="furnishingstatus"
                    name="furnishingstatus"
                    value={formData.furnishingstatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-4 px-6 font-bold text-sm uppercase tracking-wider hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors border-2 border-black mt-6"
              >
                {loading ? 'Predicting...' : 'Predict Price'}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="bg-white border-2 border-black p-4">
                <div className="flex items-center">
                  <span className="text-black mr-3 font-bold">⚠</span>
                  <p className="text-black font-medium">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="bg-white border-2 border-black p-8">
                <div className="flex items-center justify-between mb-6 border-b-2 border-black pb-4">
                  <h2 className="text-3xl font-bold text-black uppercase tracking-tight">Prediction Result</h2>
                  <span className="text-4xl text-orange-600">✓</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold text-black mb-2 uppercase tracking-wider">Predicted Price</p>
                    <p className="text-4xl font-bold text-orange-600">
                      {formatPrice(result.predicted_price)}
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-black">
                    <p className="text-xs font-bold text-black mb-3 uppercase tracking-wider">Input Features</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="font-medium">Area:</span> {result.features.area} sq ft</div>
                      <div><span className="font-medium">Bedrooms:</span> {result.features.bedrooms}</div>
                      <div><span className="font-medium">Bathrooms:</span> {result.features.bathrooms}</div>
                      <div><span className="font-medium">Stories:</span> {result.features.stories}</div>
                      <div><span className="font-medium">Parking:</span> {result.features.parking}</div>
                      <div><span className="font-medium">Main Road:</span> {result.features.mainroad}</div>
                      <div><span className="font-medium">Guest Room:</span> {result.features.guestroom}</div>
                      <div><span className="font-medium">Basement:</span> {result.features.basement}</div>
                      <div><span className="font-medium">Hot Water:</span> {result.features.hotwaterheating}</div>
                      <div><span className="font-medium">AC:</span> {result.features.airconditioning}</div>
                      <div><span className="font-medium">Preferred Area:</span> {result.features.prefarea}</div>
                      <div><span className="font-medium">Furnishing:</span> {result.features.furnishingstatus}</div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={clearResults}
                  className="w-full bg-white text-black py-3 px-4 font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors border-2 border-black mt-6"
                >
                  Clear Results
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

