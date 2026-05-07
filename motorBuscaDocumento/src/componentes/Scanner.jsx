import React, { useState } from 'react'
import './Scanner.css'

const Scanner = () => {
  const [file, setFile] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [algorithm, setAlgorithm] = useState('naive')
  const [searchData, setSearchData] = useState(null)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSearch = async () => {
    if (!file || !searchTerm) {
      alert('Selecione um arquivo e digite um termo de busca!')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('keyword', searchTerm)
    formData.append('algorithm', algorithm)

    try {
      const response = await fetch('http://localhost:8000/search', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResults(data.matches || [])
      setSearchData(data)
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="scannerpai">
    <h1>Localizador de Termos</h1>

    <div className="botaopesquisa">

      <div title="Formatos aceitos: .txt e .pdf">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
        />

        <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="selectalgoritmo"
            >
            <option value="naive">
                Busca Simples
            </option>

            <option value="kmp">
                KMP
            </option>
        </select>
      </div>

      <input
        type="text"
        placeholder="Digite a palavra ou frase..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="texto"
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        className="botaoazul"
      >
        {loading ? 'Buscando...' : 'Localizar'}
      </button>
    </div>

    <div className="resultado">
    <h3>Resultados encontrados:</h3>

    {searchData && (
        <div className="metricas">

        <p>
            Tempo: {searchData.execution_time_ms.toFixed(2)} ms
        </p>

        <p>
            Ocorrências: {searchData.occurrences}
        </p>

        <p>
            Posições: {searchData.positions.join(', ')}
        </p>

        <p>
            Tamanho do Texto (N): {searchData.text_size_n}
        </p>

        <p>
            Tamanho do Padrão (M): {searchData.pattern_size_m}
        </p>

        </div>
    )}

    {results.length > 0 ? (
        <ul className="resultadolistado">

        {results.map((res, index) => (
            <li key={index} className="item">
            ...{res}...
            </li>
        ))}

        </ul>
    ) : (
        <p className="naolocalizado">
        Nenhum resultado para exibir.
        </p>
    )}
    </div>
    </div>
  )
}

export default Scanner
