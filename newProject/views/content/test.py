import numpy as np
import pandas as pd
import glob
import os
file_dir = 'contacts.csv'
files = glob.glob(os.path.join(file_dir, "*.csv"))
print(files)