import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { useDropzone } from 'react-dropzone'

export default function ShareWinModal({ groupId, onClose }) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        setImage(file)
        const reader = new FileReader()
        reader.onload = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
      }
    }
  })

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    const filePath = `wins/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('win-images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('win-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let imageUrl = null

      if (image) {
        setUploading(true)
        imageUrl = await uploadImage(image)
        setUploading(false)
      }

      const { error: winError } = await supabase
        .from('wins')
        .insert({
          user_id: user.id,
          group_id: groupId,
          title,
          description: description || null,
          image_url: imageUrl,
        })

      if (winError) throw winError

      onClose()
    } catch (err) {
      setError(err.message || 'Failed to share win')
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl border-2 border-gray-300 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="absolute inset-0 grid-paper-section opacity-20 rounded-lg"></div>
        
        <div className="relative z-10 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>

          <h2 className="font-mono text-3xl font-bold text-gray-900 mb-6">
            Share a Win
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                placeholder="I achieved my goal!"
              />
            </div>

            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono focus:outline-none focus:border-amber-500"
                placeholder="Tell us about your achievement..."
              />
            </div>

            <div>
              <label className="block font-mono text-sm font-medium text-gray-700 mb-2">
                Image (optional)
              </label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-amber-400 transition-colors"
              >
                <input {...getInputProps()} />
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-2" />
                    <p className="font-mono text-sm text-gray-600">Click to change image</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-mono text-sm text-gray-600">
                      Drag & drop an image here, or click to select
                    </p>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3">
                <p className="font-mono text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-mono rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : loading ? 'Sharing...' : 'Share Win'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

