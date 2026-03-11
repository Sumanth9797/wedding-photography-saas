import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FiDownload, FiImage } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { galleryService } from '../../services/galleryService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Button from '../../components/common/Button'

export default function DownloadPage() {
  const { token } = useParams()
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    galleryService.getDownloads(token)
      .then(res => setDownloads(res.data.downloadUrls || []))
      .catch(err => {
        if (err.response?.status === 403) {
          toast.error('Downloads not enabled yet. Please wait for your photographer.')
        } else {
          toast.error('Failed to load download links')
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleDownloadAll = () => {
    downloads.forEach((url, i) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = url
        a.download = `photo_${i + 1}.jpg`
        a.click()
      }, i * 200)
    })
    toast.success(`Downloading ${downloads.length} photos...`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiDownload className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Download Your Photos</h1>
          <p className="text-gray-500 mt-1">Your approved photos are ready for download</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {downloads.length === 0 ? (
              <div className="text-center py-8">
                <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No photos available for download yet.</p>
                <p className="text-sm text-gray-400 mt-1">Your photographer needs to enable downloads.</p>
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-primary">{downloads.length}</p>
                  <p className="text-gray-500 text-sm">Photos ready</p>
                </div>

                <Button variant="accent" size="lg" onClick={handleDownloadAll} className="w-full">
                  <FiDownload /> Download All Photos
                </Button>

                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {downloads.map((url, i) => (
                    <a key={i} href={url} download={`photo_${i+1}.jpg`}
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <FiImage className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
