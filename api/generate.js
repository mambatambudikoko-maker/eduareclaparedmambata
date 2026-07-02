export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  var prompt = req.body.prompt;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return res.status(400).json({ error: 'Le texte de description est vide.' });
  }

  if (prompt.length > 2500) {
    return res.status(400).json({ error: 'Le texte est trop long (max 2500 caractères).' });
  }

  var apiKey = process.env.KIE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Configuration serveur manquante (clé API absente).' });
  }

  try {
    var response = await fetch('https://api.kie.ai/api/v1/jobs/createTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'kling-3-0',
        input: {
          prompt: prompt,
          duration: 10,
          aspect_ratio: '9:16',
          mode: 'std',
          sound: true
        }
      })
    });

    var data = await response.json();

    if (!response.ok || data.code !== 200) {
      return res.status(502).json({ error: data.msg || 'Erreur lors de la génération.' });
    }

    return res.status(200).json({ taskId: data.data.taskId });

  } catch (err) {
    return res.status(500).json({ error: 'Erreur de connexion au service de génération.' });
  }
}
api.kie.ai
api.kie.ai
Rédiger
